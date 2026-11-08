import { DurableObject } from "cloudflare:workers";

const ADAPTER_ID="OPENAI-CHATGPT-MCP-ATTESTATION-001";
const OPENAI_CLIENT_ID="https://chatgpt.com/oauth/client.json";
const OPENAI_JWKS_URI="https://chatgpt.com/oauth/jwks.json";
const MAX_ASSERTION_LIFETIME_SECONDS=600;
const CLOCK_SKEW_SECONDS=60;

function json(value,status=200,extra={}){
  return new Response(JSON.stringify(value,null,2),{
    status,
    headers:{
      "content-type":"application/json; charset=utf-8",
      "cache-control":"no-store",
      "x-tyme-authority-state":"none",
      "x-tyme-institutional-effect":"none",
      ...extra
    }
  });
}

function fromB64url(value){
  const s=value.replace(/-/g,"+").replace(/_/g,"/");
  const padded=s+"=".repeat((4-s.length%4)%4);
  const raw=atob(padded);
  return Uint8Array.from(raw,c=>c.charCodeAt(0));
}
function toB64url(bytes){
  let s="";for(const b of bytes)s+=String.fromCharCode(b);
  return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
async function sha256Hex(text){
  const h=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text));
  return Array.from(new Uint8Array(h),b=>b.toString(16).padStart(2,"0")).join("");
}
function parseJsonB64url(part){
  return JSON.parse(new TextDecoder().decode(fromB64url(part)));
}
function normalizeAud(aud){
  if(typeof aud==="string")return[aud];
  if(Array.isArray(aud)&&aud.every(x=>typeof x==="string"))return aud;
  return[];
}
async function fetchJsonWithText(url){
  const r=await fetch(url,{headers:{"accept":"application/json"}});
  const text=await r.text();
  if(!r.ok)throw new Error("FETCH_FAILED:"+url+":"+r.status);
  return {json:JSON.parse(text),text,status:r.status};
}
async function fetchOpenAIClientMetadata(){
  const cimd=await fetchJsonWithText(OPENAI_CLIENT_ID);
  const m=cimd.json;
  if(m.client_id!==OPENAI_CLIENT_ID)throw new Error("CIMD_CLIENT_ID_MISMATCH");
  if(m.client_name!=="ChatGPT")throw new Error("CIMD_CLIENT_NAME_MISMATCH");
  const methods=Array.isArray(m.token_endpoint_auth_methods_supported)?m.token_endpoint_auth_methods_supported:[];
  if(!methods.includes("private_key_jwt"))throw new Error("CIMD_PRIVATE_KEY_JWT_NOT_SUPPORTED");
  if(m.token_endpoint_auth_signing_alg!=="RS256")throw new Error("CIMD_SIGNING_ALG_UNEXPECTED");
  if(m.jwks_uri!==OPENAI_JWKS_URI)throw new Error("CIMD_JWKS_URI_UNEXPECTED");
  const jwks=await fetchJsonWithText(m.jwks_uri);
  if(!Array.isArray(jwks.json.keys)||jwks.json.keys.length<1)throw new Error("OPENAI_JWKS_EMPTY");
  return {
    client:m,
    client_document_digest:await sha256Hex(cimd.text),
    jwks:jwks.json,
    jwks_document_digest:await sha256Hex(jwks.text)
  };
}
async function verifyJwtWithJwks(assertion,jwks,expected){
  if(typeof assertion!=="string"||assertion.length<40)throw new Error("ASSERTION_REQUIRED");
  const parts=assertion.split(".");
  if(parts.length!==3)throw new Error("JWT_FORMAT_INVALID");
  const header=parseJsonB64url(parts[0]);
  const claims=parseJsonB64url(parts[1]);

  if(header.alg!=="RS256")throw new Error("JWT_ALG_NOT_RS256");
  if(typeof header.kid!=="string"||!header.kid)throw new Error("JWT_KID_REQUIRED");
  const jwk=jwks.keys.find(k=>k&&k.kid===header.kid);
  if(!jwk)throw new Error("JWT_KID_NOT_FOUND");
  if(jwk.kty!=="RSA")throw new Error("JWT_KEY_NOT_RSA");
  if(jwk.alg&&jwk.alg!=="RS256")throw new Error("JWT_JWK_ALG_MISMATCH");
  if(jwk.use&&jwk.use!=="sig")throw new Error("JWT_JWK_USE_INVALID");

  const key=await crypto.subtle.importKey(
    "jwk",jwk,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["verify"]
  );
  const verified=await crypto.subtle.verify(
    {name:"RSASSA-PKCS1-v1_5"},
    key,
    fromB64url(parts[2]),
    new TextEncoder().encode(parts[0]+"."+parts[1])
  );
  if(!verified)throw new Error("JWT_SIGNATURE_INVALID");

  const now=Math.floor(Date.now()/1000);
  if(claims.iss!==expected.client_id)throw new Error("JWT_ISS_MISMATCH");
  if(claims.sub!==expected.client_id)throw new Error("JWT_SUB_MISMATCH");
  if(typeof claims.exp!=="number")throw new Error("JWT_EXP_REQUIRED");
  if(claims.exp<now-CLOCK_SKEW_SECONDS)throw new Error("JWT_EXPIRED");
  if(claims.exp>now+MAX_ASSERTION_LIFETIME_SECONDS)throw new Error("JWT_EXP_TOO_FAR");
  if(typeof claims.iat==="number"&&claims.iat>now+CLOCK_SKEW_SECONDS)throw new Error("JWT_IAT_IN_FUTURE");
  if(typeof claims.nbf==="number"&&claims.nbf>now+CLOCK_SKEW_SECONDS)throw new Error("JWT_NBF_IN_FUTURE");

  const auds=normalizeAud(claims.aud);
  let audience_profile=null;
  if(auds.length===1&&auds[0]===expected.authorization_server_issuer){
    audience_profile="rfc10070_issuer";
  }else if(auds.length===1&&auds[0]===expected.token_endpoint){
    audience_profile="rfc7523_legacy_token_endpoint";
  }else{
    throw new Error("JWT_AUD_MISMATCH");
  }

  return {header,claims,audience_profile};
}

export class OpenAIAssertionEvidence extends DurableObject{
  constructor(ctx,env){
    super(ctx,env);
    this.sql=ctx.storage.sql;
    ctx.blockConcurrencyWhile(async()=>{
      this.sql.exec(`
        CREATE TABLE IF NOT EXISTS used_assertions (
          replay_key TEXT PRIMARY KEY,
          first_seen_at TEXT NOT NULL,
          expires_at INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS attestations (
          attestation_id TEXT PRIMARY KEY,
          assertion_digest TEXT NOT NULL,
          client_id TEXT NOT NULL,
          kid TEXT NOT NULL,
          audience_profile TEXT NOT NULL,
          issued_at INTEGER,
          expires_at INTEGER NOT NULL,
          jti TEXT,
          client_document_digest TEXT NOT NULL,
          jwks_document_digest TEXT NOT NULL,
          binding_json TEXT NOT NULL,
          record_json TEXT NOT NULL,
          stored_at TEXT NOT NULL
        );
      `);
    });
  }
  consumeAndStore(replayKey,exp,record){
    const nowEpoch=Math.floor(Date.now()/1000);
    this.sql.exec("DELETE FROM used_assertions WHERE expires_at < ?",nowEpoch-CLOCK_SKEW_SECONDS);
    const existing=this.sql.exec("SELECT replay_key FROM used_assertions WHERE replay_key=?",replayKey).toArray()[0]||null;
    if(existing)return{ok:false,error:"ASSERTION_REPLAY"};
    const now=new Date().toISOString();
    this.sql.exec(
      "INSERT INTO used_assertions(replay_key,first_seen_at,expires_at) VALUES(?,?,?)",
      replayKey,now,exp
    );
    this.sql.exec(
      "INSERT INTO attestations(attestation_id,assertion_digest,client_id,kid,audience_profile,issued_at,expires_at,jti,client_document_digest,jwks_document_digest,binding_json,record_json,stored_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
      record.attestation_id,record.assertion_digest,record.client_id,record.kid,record.audience_profile,
      record.issued_at,record.expires_at,record.jti,record.client_document_digest,record.jwks_document_digest,
      JSON.stringify(record.tyme_binding),JSON.stringify(record),now
    );
    return{ok:true,stored_at:now,attestation:record};
  }
}

async function buildVerifiedRecord(assertion,metadata,expected,binding){
  const verified=await verifyJwtWithJwks(assertion,metadata.jwks,expected);
  const assertionDigest=await sha256Hex(assertion);
  const replayKey=typeof verified.claims.jti==="string"&&verified.claims.jti
    ?"jti:"+verified.claims.jti
    :"sha256:"+assertionDigest;
  const record={
    schema_version:"0.1",
    adapter_id:ADAPTER_ID,
    provider:"OpenAI",
    product:"ChatGPT",
    attestation_scope:"provider_transport_client",
    attestation_direction:"provider_to_tyme",
    verification_method:"cimd_private_key_jwt",
    client_id:expected.client_id,
    client_name:metadata.client.client_name,
    kid:verified.header.kid,
    algorithm:"RS256",
    assertion_digest:assertionDigest,
    jti:typeof verified.claims.jti==="string"?verified.claims.jti:null,
    issued_at:typeof verified.claims.iat==="number"?verified.claims.iat:null,
    expires_at:verified.claims.exp,
    audience_profile:verified.audience_profile,
    client_document_digest:metadata.client_document_digest,
    jwks_uri:metadata.client.jwks_uri,
    jwks_document_digest:metadata.jwks_document_digest,
    tyme_binding:{
      participant_id:binding.participant_id,
      connection_id:binding.connection_id,
      binding_authority:"tyme_oauth_server",
      provider_signed:false
    },
    model_runtime_state:"not_established",
    session_state:"not_established",
    institutional_authority_state:"none",
    limitations:[
      "OpenAI signature attests the ChatGPT OAuth/MCP client identity, not a specific GPT model.",
      "The TYME participant/connection binding is performed by TYME and is not covered by the OpenAI client assertion.",
      "This record grants no institutional authority."
    ]
  };
  return {record,replayKey,exp:verified.claims.exp};
}

export default{
  async fetch(request,env){
    const url=new URL(request.url);

    if(url.pathname==="/health"&&request.method==="GET"){
      return json({
        service:"tyme-openai-chatgpt-mcp-attestation-v0",
        status:"ok",
        adapter_id:ADAPTER_ID,
        client_id:OPENAI_CLIENT_ID,
        jwks_uri:OPENAI_JWKS_URI,
        attestation_scope:"provider_transport_client",
        production_route:"not_attached",
        authority_state:"none"
      });
    }

    if(url.pathname==="/api/v0/openai/client-metadata"&&request.method==="GET"){
      try{
        const m=await fetchOpenAIClientMetadata();
        return json({
          ok:true,
          client_id:m.client.client_id,
          client_name:m.client.client_name,
          token_endpoint_auth_methods_supported:m.client.token_endpoint_auth_methods_supported,
          token_endpoint_auth_signing_alg:m.client.token_endpoint_auth_signing_alg,
          jwks_uri:m.client.jwks_uri,
          client_document_digest:m.client_document_digest,
          jwks_document_digest:m.jwks_document_digest,
          jwks_kids:m.jwks.keys.map(k=>k.kid),
          authority_state:"none"
        });
      }catch(e){
        return json({ok:false,error:"OPENAI_METADATA_VALIDATION_FAILED",message:String(e)},502);
      }
    }

    if(url.pathname==="/api/v0/openai/verify-client-assertion"&&request.method==="POST"){
      if(request.headers.get("x-tyme-openai-adapter-token")!==env.ADAPTER_CALL_TOKEN){
        return json({ok:false,error:"ADAPTER_CALL_TOKEN_REQUIRED"},403);
      }
      let input;
      try{input=await request.json();}catch{return json({ok:false,error:"INVALID_JSON"},400);}
      if(!input.binding_context||typeof input.binding_context.participant_id!=="string"||typeof input.binding_context.connection_id!=="string"){
        return json({ok:false,error:"BINDING_CONTEXT_REQUIRED"},400);
      }
      if(typeof input.authorization_server_issuer!=="string"||typeof input.token_endpoint!=="string"){
        return json({ok:false,error:"EXPECTED_AUDIENCE_CONTEXT_REQUIRED"},400);
      }
      try{
        const metadata=await fetchOpenAIClientMetadata();
        const built=await buildVerifiedRecord(
          input.client_assertion,
          metadata,
          {
            client_id:OPENAI_CLIENT_ID,
            authorization_server_issuer:input.authorization_server_issuer,
            token_endpoint:input.token_endpoint
          },
          input.binding_context
        );
        const store=env.EVIDENCE.getByName("openai-chatgpt");
        const stored=await store.consumeAndStore(built.replayKey,built.exp,built.record);
        if(!stored.ok)return json(stored,409);
        return json({
          ok:true,
          state:"provider_attested",
          attestation:stored.attestation,
          stored_at:stored.stored_at,
          authority_state:"none",
          institutional_effect:"none"
        },201);
      }catch(e){
        return json({ok:false,error:"OPENAI_ASSERTION_VERIFICATION_FAILED",message:String(e)},401);
      }
    }

    return json({ok:false,error:"NOT_FOUND"},404);
  }
};