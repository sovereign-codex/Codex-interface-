import { DurableObject } from "cloudflare:workers";

const PROTOCOL="TYME-PROVIDER-ATTESTATION-001";
const MAX_ATTESTATION_MS=24*60*60*1000;

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
function b64url(bytes){
  let s="";for(const b of bytes)s+=String.fromCharCode(b);
  return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function fromB64url(value){
  const s=value.replace(/-/g,"+").replace(/_/g,"/");
  const padded=s+"=".repeat((4-s.length%4)%4);
  const raw=atob(padded);
  return Uint8Array.from(raw,c=>c.charCodeAt(0));
}
async function sha256B64url(text){
  return b64url(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text))));
}
function canonicalJwk(jwk){
  return JSON.stringify({crv:"Ed25519",kty:"OKP",x:jwk.x});
}
function validateJwk(jwk){
  return !!jwk && jwk.kty==="OKP" && jwk.crv==="Ed25519" && typeof jwk.x==="string" && jwk.x.length>=40 && jwk.x.length<=60;
}
function canonicalAttestation(a){
  return JSON.stringify({
    schema_version:a.schema_version,
    attestation_id:a.attestation_id,
    provider_id:a.provider_id,
    provider_key_id:a.provider_key_id,
    subject_participant_id:a.subject_participant_id,
    subject_key_thumbprint:a.subject_key_thumbprint,
    provider_subject:a.provider_subject,
    model_id:a.model_id??null,
    runtime_id:a.runtime_id??null,
    session_ref:a.session_ref??null,
    issued_at:a.issued_at,
    not_before:a.not_before,
    expires_at:a.expires_at,
    assurance_level:a.assurance_level,
    claims:a.claims||{}
  });
}
function validateAttestation(a){
  if(!a||typeof a!=="object"||Array.isArray(a))return"attestation object required";
  if(a.schema_version!=="0.1")return"schema_version must be 0.1";
  for(const k of ["attestation_id","provider_id","provider_key_id","subject_participant_id","subject_key_thumbprint","provider_subject","issued_at","not_before","expires_at"]){
    if(typeof a[k]!=="string"||!a[k].trim())return k+" required";
  }
  if(a.assurance_level!=="provider_signed_key_binding")return"assurance_level invalid";
  const issued=Date.parse(a.issued_at),nbf=Date.parse(a.not_before),exp=Date.parse(a.expires_at);
  if(!Number.isFinite(issued)||!Number.isFinite(nbf)||!Number.isFinite(exp))return"invalid timestamps";
  if(nbf<issued-60000)return"not_before precedes issued_at beyond tolerance";
  if(exp<=nbf)return"expires_at must follow not_before";
  if(exp-issued>MAX_ATTESTATION_MS)return"attestation lifetime exceeds 24 hours";
  if(a.claims!==undefined && (typeof a.claims!=="object"||a.claims===null||Array.isArray(a.claims)))return"claims must be object";
  return null;
}

export class ProviderTrust extends DurableObject {
  constructor(ctx,env){
    super(ctx,env);
    this.sql=ctx.storage.sql;
    ctx.blockConcurrencyWhile(async()=>{
      this.sql.exec(`
        CREATE TABLE IF NOT EXISTS provider_meta (
          slot INTEGER PRIMARY KEY CHECK(slot=1),
          provider_id TEXT NOT NULL,
          provider_name TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS keys (
          key_id TEXT PRIMARY KEY,
          public_key_jwk TEXT NOT NULL,
          public_key_thumbprint TEXT NOT NULL,
          status TEXT NOT NULL,
          valid_from TEXT NOT NULL,
          valid_until TEXT,
          enrolled_at TEXT NOT NULL,
          retired_at TEXT,
          revoked_at TEXT,
          revocation_reason TEXT
        );
      `);
    });
  }
  ensureProvider(providerId,providerName,now){
    const meta=this.sql.exec("SELECT * FROM provider_meta WHERE slot=1").toArray()[0]||null;
    if(!meta){
      this.sql.exec("INSERT INTO provider_meta(slot,provider_id,provider_name,created_at) VALUES(1,?,?,?)",providerId,providerName,now);
      return {ok:true};
    }
    if(meta.provider_id!==providerId)return{ok:false,error:"PROVIDER_ID_MISMATCH"};
    return{ok:true};
  }
  addKey(record){
    const existing=this.sql.exec("SELECT * FROM keys WHERE key_id=?",record.key_id).toArray()[0]||null;
    if(existing){
      if(existing.public_key_thumbprint===record.public_key_thumbprint)return{ok:true,idempotent:true,key:this.publicKey(existing)};
      return{ok:false,error:"KEY_ID_COLLISION"};
    }
    this.sql.exec(
      "INSERT INTO keys(key_id,public_key_jwk,public_key_thumbprint,status,valid_from,valid_until,enrolled_at,retired_at,revoked_at,revocation_reason) VALUES(?,?,?,?,?,?,?,NULL,NULL,NULL)",
      record.key_id,JSON.stringify(record.public_key_jwk),record.public_key_thumbprint,"active",record.valid_from,record.valid_until,record.enrolled_at
    );
    return{ok:true,idempotent:false,key:this.publicKey({...record,status:"active"})};
  }
  rotateKey(record,retireKeyId,now){
    if(retireKeyId){
      const old=this.sql.exec("SELECT * FROM keys WHERE key_id=?",retireKeyId).toArray()[0]||null;
      if(!old)return{ok:false,error:"RETIRE_KEY_NOT_FOUND"};
      if(old.status==="revoked")return{ok:false,error:"RETIRE_KEY_REVOKED"};
      this.sql.exec("UPDATE keys SET status='retired',retired_at=? WHERE key_id=?",now,retireKeyId);
    }
    return this.addKey(record);
  }
  revokeKey(keyId,reason,now){
    const row=this.sql.exec("SELECT * FROM keys WHERE key_id=?",keyId).toArray()[0]||null;
    if(!row)return{ok:false,error:"KEY_NOT_FOUND"};
    if(row.status==="revoked")return{ok:true,idempotent:true,key:this.publicKey(row)};
    this.sql.exec("UPDATE keys SET status='revoked',revoked_at=?,revocation_reason=? WHERE key_id=?",now,reason,keyId);
    const after=this.sql.exec("SELECT * FROM keys WHERE key_id=?",keyId).one();
    return{ok:true,idempotent:false,key:this.publicKey(after)};
  }
  getKey(keyId){
    const row=this.sql.exec("SELECT * FROM keys WHERE key_id=?",keyId).toArray()[0]||null;
    if(!row)return null;
    return{...this.publicKey(row),public_key_jwk:JSON.parse(row.public_key_jwk)};
  }
  publicKey(row){
    return{
      key_id:row.key_id,
      public_key_thumbprint:row.public_key_thumbprint,
      status:row.status,
      valid_from:row.valid_from,
      valid_until:row.valid_until||null,
      enrolled_at:row.enrolled_at,
      retired_at:row.retired_at||null,
      revoked_at:row.revoked_at||null,
      revocation_reason:row.revocation_reason||null
    };
  }
}

export class ParticipantAttestations extends DurableObject {
  constructor(ctx,env){
    super(ctx,env);
    this.sql=ctx.storage.sql;
    ctx.blockConcurrencyWhile(async()=>{
      this.sql.exec(`
        CREATE TABLE IF NOT EXISTS attestations (
          attestation_id TEXT PRIMARY KEY,
          provider_id TEXT NOT NULL,
          provider_key_id TEXT NOT NULL,
          subject_participant_id TEXT NOT NULL,
          subject_key_thumbprint TEXT NOT NULL,
          provider_subject TEXT NOT NULL,
          model_id TEXT,
          runtime_id TEXT,
          session_ref TEXT,
          issued_at TEXT NOT NULL,
          not_before TEXT NOT NULL,
          expires_at TEXT NOT NULL,
          assurance_level TEXT NOT NULL,
          claims_json TEXT NOT NULL,
          signature_value TEXT NOT NULL,
          stored_at TEXT NOT NULL,
          revoked_at TEXT,
          revocation_reason TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_attestations_subject_key ON attestations(subject_key_thumbprint);
      `);
    });
  }
  store(record){
    const existing=this.sql.exec("SELECT * FROM attestations WHERE attestation_id=?",record.attestation_id).toArray()[0]||null;
    if(existing){
      if(existing.signature_value===record.signature_value)return{ok:true,idempotent:true,attestation:this.publicRow(existing)};
      return{ok:false,error:"ATTESTATION_ID_COLLISION"};
    }
    this.sql.exec(
      `INSERT INTO attestations(
        attestation_id,provider_id,provider_key_id,subject_participant_id,subject_key_thumbprint,
        provider_subject,model_id,runtime_id,session_ref,issued_at,not_before,expires_at,
        assurance_level,claims_json,signature_value,stored_at,revoked_at,revocation_reason
      ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NULL,NULL)`,
      record.attestation_id,record.provider_id,record.provider_key_id,record.subject_participant_id,record.subject_key_thumbprint,
      record.provider_subject,record.model_id,record.runtime_id,record.session_ref,record.issued_at,record.not_before,record.expires_at,
      record.assurance_level,JSON.stringify(record.claims||{}),record.signature_value,record.stored_at
    );
    const row=this.sql.exec("SELECT * FROM attestations WHERE attestation_id=?",record.attestation_id).one();
    return{ok:true,idempotent:false,attestation:this.publicRow(row)};
  }
  revoke(attestationId,reason,now){
    const row=this.sql.exec("SELECT * FROM attestations WHERE attestation_id=?",attestationId).toArray()[0]||null;
    if(!row)return{ok:false,error:"ATTESTATION_NOT_FOUND"};
    if(row.revoked_at)return{ok:true,idempotent:true,attestation:this.publicRow(row)};
    this.sql.exec("UPDATE attestations SET revoked_at=?,revocation_reason=? WHERE attestation_id=?",now,reason,attestationId);
    const after=this.sql.exec("SELECT * FROM attestations WHERE attestation_id=?",attestationId).one();
    return{ok:true,idempotent:false,attestation:this.publicRow(after)};
  }
  findCandidates(keyThumbprint,now){
    return this.sql.exec(
      "SELECT * FROM attestations WHERE subject_key_thumbprint=? AND revoked_at IS NULL AND not_before<=? AND expires_at>? ORDER BY issued_at DESC",
      keyThumbprint,now,now
    ).toArray().map(row=>({...this.publicRow(row),signature_value:row.signature_value,claims:JSON.parse(row.claims_json)}));
  }
  get(attestationId){
    const row=this.sql.exec("SELECT * FROM attestations WHERE attestation_id=?",attestationId).toArray()[0]||null;
    if(!row)return null;
    return{...this.publicRow(row),signature_value:row.signature_value,claims:JSON.parse(row.claims_json)};
  }
  publicRow(row){
    return{
      attestation_id:row.attestation_id,
      provider_id:row.provider_id,
      provider_key_id:row.provider_key_id,
      subject_participant_id:row.subject_participant_id,
      subject_key_thumbprint:row.subject_key_thumbprint,
      provider_subject:row.provider_subject,
      model_id:row.model_id||null,
      runtime_id:row.runtime_id||null,
      session_ref:row.session_ref||null,
      issued_at:row.issued_at,
      not_before:row.not_before,
      expires_at:row.expires_at,
      assurance_level:row.assurance_level,
      stored_at:row.stored_at,
      revoked_at:row.revoked_at||null,
      revocation_reason:row.revocation_reason||null
    };
  }
}

export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname==="/health"&&request.method==="GET"){
      return json({service:"tyme-provider-attestation-v0",status:"ok",authority_state:"none",production_route:"not_attached"});
    }
    if(request.method!=="POST")return json({ok:false,error:"METHOD_NOT_ALLOWED"},405);

    let input;
    try{input=await request.json();}catch{return json({ok:false,error:"INVALID_JSON"},400);}

    const admin=request.headers.get("x-tyme-provider-admin")===env.PROVIDER_ADMIN_TOKEN;

    if(url.pathname==="/api/v0/provider/keys/enroll"){
      if(!admin)return json({ok:false,error:"PROVIDER_ADMIN_REQUIRED"},403);
      if(typeof input.provider_id!=="string"||!input.provider_id.trim())return json({ok:false,error:"INVALID_PROVIDER_ID"},400);
      if(typeof input.provider_name!=="string"||!input.provider_name.trim())return json({ok:false,error:"INVALID_PROVIDER_NAME"},400);
      if(typeof input.key_id!=="string"||!input.key_id.trim())return json({ok:false,error:"INVALID_KEY_ID"},400);
      if(!validateJwk(input.public_key_jwk))return json({ok:false,error:"INVALID_ED25519_JWK"},400);
      const now=new Date().toISOString();
      const validFrom=input.valid_from||now;
      const validUntil=input.valid_until||null;
      const thumbprint=await sha256B64url(canonicalJwk(input.public_key_jwk));
      const stub=env.PROVIDERS.getByName(input.provider_id.trim());
      const ensured=await stub.ensureProvider(input.provider_id.trim(),input.provider_name.trim(),now);
      if(!ensured.ok)return json(ensured,409);
      const result=await stub.addKey({
        key_id:input.key_id.trim(),
        public_key_jwk:input.public_key_jwk,
        public_key_thumbprint:thumbprint,
        valid_from:validFrom,
        valid_until:validUntil,
        enrolled_at:now
      });
      return json(result,result.ok?201:409);
    }

    if(url.pathname==="/api/v0/provider/keys/rotate"){
      if(!admin)return json({ok:false,error:"PROVIDER_ADMIN_REQUIRED"},403);
      if(typeof input.provider_id!=="string"||!input.provider_id.trim())return json({ok:false,error:"INVALID_PROVIDER_ID"},400);
      if(typeof input.provider_name!=="string"||!input.provider_name.trim())return json({ok:false,error:"INVALID_PROVIDER_NAME"},400);
      if(typeof input.new_key_id!=="string"||!input.new_key_id.trim())return json({ok:false,error:"INVALID_NEW_KEY_ID"},400);
      if(!validateJwk(input.new_public_key_jwk))return json({ok:false,error:"INVALID_ED25519_JWK"},400);
      const now=new Date().toISOString();
      const thumbprint=await sha256B64url(canonicalJwk(input.new_public_key_jwk));
      const stub=env.PROVIDERS.getByName(input.provider_id.trim());
      const ensured=await stub.ensureProvider(input.provider_id.trim(),input.provider_name.trim(),now);
      if(!ensured.ok)return json(ensured,409);
      const result=await stub.rotateKey({
        key_id:input.new_key_id.trim(),
        public_key_jwk:input.new_public_key_jwk,
        public_key_thumbprint:thumbprint,
        valid_from:input.valid_from||now,
        valid_until:input.valid_until||null,
        enrolled_at:now
      },typeof input.retire_key_id==="string"&&input.retire_key_id.trim()?input.retire_key_id.trim():null,now);
      return json(result,result.ok?201:409);
    }

    if(url.pathname==="/api/v0/provider/keys/revoke"){
      if(!admin)return json({ok:false,error:"PROVIDER_ADMIN_REQUIRED"},403);
      if(typeof input.provider_id!=="string"||!input.provider_id.trim()||typeof input.key_id!=="string"||!input.key_id.trim())return json({ok:false,error:"PROVIDER_AND_KEY_REQUIRED"},400);
      const stub=env.PROVIDERS.getByName(input.provider_id.trim());
      const result=await stub.revokeKey(input.key_id.trim(),typeof input.reason==="string"?input.reason.slice(0,300):"unspecified",new Date().toISOString());
      return json(result,result.ok?200:404);
    }

    if(url.pathname==="/api/v0/provider/attestations"){
      const err=validateAttestation(input.attestation);
      if(err)return json({ok:false,error:"INVALID_ATTESTATION",message:err},400);
      if(!input.signature||input.signature.algorithm!=="Ed25519"||input.signature.encoding!=="base64url"||typeof input.signature.value!=="string")return json({ok:false,error:"INVALID_SIGNATURE_ENVELOPE"},400);
      const a=input.attestation;
      const provider=env.PROVIDERS.getByName(a.provider_id);
      const key=await provider.getKey(a.provider_key_id);
      if(!key)return json({ok:false,error:"PROVIDER_KEY_NOT_FOUND"},404);
      if(key.status==="revoked")return json({ok:false,error:"PROVIDER_KEY_REVOKED"},401);
      const issued=Date.parse(a.issued_at);
      if(issued<Date.parse(key.valid_from))return json({ok:false,error:"ATTESTATION_BEFORE_KEY_VALIDITY"},400);
      if(key.valid_until&&issued>=Date.parse(key.valid_until))return json({ok:false,error:"ATTESTATION_AFTER_KEY_VALIDITY"},400);
      let publicKey;
      try{publicKey=await crypto.subtle.importKey("jwk",key.public_key_jwk,{name:"Ed25519"},false,["verify"]);}catch(e){return json({ok:false,error:"PROVIDER_KEY_IMPORT_FAILED",message:String(e)},500);}
      let sig;
      try{sig=fromB64url(input.signature.value);}catch{return json({ok:false,error:"INVALID_SIGNATURE_ENCODING"},400);}
      const signed=JSON.stringify({protocol:PROTOCOL,attestation:a});
      const verified=await crypto.subtle.verify("Ed25519",publicKey,sig,new TextEncoder().encode(signed));
      if(!verified)return json({ok:false,error:"PROVIDER_SIGNATURE_INVALID"},401);
      const subject=env.ATTESTATIONS.getByName(a.subject_participant_id);
      const result=await subject.store({...a,signature_value:input.signature.value,stored_at:new Date().toISOString()});
      return json({...result,signature_state:"verified",provider_key_state:key.status,authority_state:"none"},result.ok?201:409);
    }

    if(url.pathname==="/api/v0/provider/attestations/revoke"){
      if(!admin)return json({ok:false,error:"PROVIDER_ADMIN_REQUIRED"},403);
      if(typeof input.participant_id!=="string"||!input.participant_id.trim()||typeof input.attestation_id!=="string"||!input.attestation_id.trim())return json({ok:false,error:"PARTICIPANT_AND_ATTESTATION_REQUIRED"},400);
      const subject=env.ATTESTATIONS.getByName(input.participant_id.trim());
      const result=await subject.revoke(input.attestation_id.trim(),typeof input.reason==="string"?input.reason.slice(0,300):"unspecified",new Date().toISOString());
      return json(result,result.ok?200:404);
    }

    if(url.pathname==="/api/v0/provider/attestations/resolve"){
      if(request.headers.get("x-tyme-provider-query")!==env.PROVIDER_QUERY_TOKEN)return json({ok:false,error:"QUERY_TOKEN_REQUIRED"},403);
      if(typeof input.participant_id!=="string"||!input.participant_id.trim()||typeof input.subject_key_thumbprint!=="string"||!input.subject_key_thumbprint.trim())return json({ok:false,error:"PARTICIPANT_AND_KEY_REQUIRED"},400);
      const now=new Date().toISOString();
      const subject=env.ATTESTATIONS.getByName(input.participant_id.trim());
      const candidates=await subject.findCandidates(input.subject_key_thumbprint.trim(),now);
      for(const a of candidates){
        const provider=env.PROVIDERS.getByName(a.provider_id);
        const key=await provider.getKey(a.provider_key_id);
        if(!key||key.status==="revoked")continue;
        return json({
          ok:true,
          state:"provider_attested",
          attestation:a,
          provider_key:{
            key_id:key.key_id,
            public_key_thumbprint:key.public_key_thumbprint,
            status:key.status
          },
          authority_state:"none",
          institutional_effect:"none"
        });
      }
      return json({ok:true,state:"not_established",attestation:null,authority_state:"none",institutional_effect:"none"});
    }

    return json({ok:false,error:"NOT_FOUND"},404);
  }
};