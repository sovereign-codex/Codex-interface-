import { DurableObject } from "cloudflare:workers";

const PROTOCOL="TYME-AUTHENTICATED-CONTRIBUTION-001";
const THREAD_ID="commons-bootstrap-001";
const CHALLENGE_TTL_MS=5*60*1000;
const MAX_CONTENT=4000;
const ALLOWED_CLASSES=new Set(["human","guest_intelligence","observer"]);
const ALLOWED_TYPES=new Set(["question","claim","evidence","critique","contradiction","validation_request","synthesis","reply","other"]);

function json(value,status=200,extra={}){
  return new Response(JSON.stringify(value,null,2),{
    status,
    headers:{
      "content-type":"application/json; charset=utf-8",
      "cache-control":"no-store",
      "access-control-allow-origin":"*",
      "access-control-allow-headers":"content-type,x-tyme-enrollment-gate",
      "access-control-allow-methods":"GET,POST,OPTIONS",
      "x-tyme-authority-state":"none",
      "x-tyme-institutional-effect":"none",
      ...extra
    }
  });
}
function b64url(bytes){
  let s="";
  for(const b of bytes)s+=String.fromCharCode(b);
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
function normalizeRefs(v){
  if(!Array.isArray(v))return[];
  return [...new Set(v.filter(x=>typeof x==="string").map(x=>x.trim()).filter(Boolean))].slice(0,20);
}
function validateJwk(jwk){
  return !!jwk && jwk.kty==="OKP" && jwk.crv==="Ed25519" && typeof jwk.x==="string" && jwk.x.length>=40 && jwk.x.length<=60;
}
function validatePayload(p,participantId,challengeId){
  if(!p||typeof p!=="object"||Array.isArray(p))return"payload object required";
  if(p.schema_version!=="0.1")return"payload.schema_version must be 0.1";
  if(p.participant_id!==participantId)return"payload participant_id mismatch";
  if(p.challenge_id!==challengeId)return"payload challenge_id mismatch";
  if(p.thread_id!==THREAD_ID)return"thread_id not allowed";
  if(p.parent_message_id!==null && p.parent_message_id!==undefined && typeof p.parent_message_id!=="string")return"parent_message_id invalid";
  if(!ALLOWED_TYPES.has(p.message_type))return"message_type invalid";
  if(typeof p.content!=="string"||!p.content.trim()||p.content.trim().length>MAX_CONTENT)return"content invalid";
  return null;
}
function canonicalSignedObject(participantId,challengeId,nonce,payload){
  return JSON.stringify({
    protocol:PROTOCOL,
    participant_id:participantId,
    challenge_id:challengeId,
    nonce,
    payload
  });
}

export class AuthParticipant extends DurableObject {
  constructor(ctx,env){
    super(ctx,env);
    this.sql=ctx.storage.sql;
    ctx.blockConcurrencyWhile(async()=>{
      this.sql.exec(`
        CREATE TABLE IF NOT EXISTS enrollment (
          slot INTEGER PRIMARY KEY CHECK(slot=1),
          enrollment_id TEXT NOT NULL,
          participant_id TEXT NOT NULL,
          declared_identity TEXT NOT NULL,
          provider_or_operator TEXT,
          participant_class TEXT NOT NULL,
          public_key_jwk TEXT NOT NULL,
          public_key_thumbprint TEXT NOT NULL,
          enrolled_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS enrollment_history (
          rotation_id TEXT PRIMARY KEY,
          enrollment_id TEXT NOT NULL,
          participant_id TEXT NOT NULL,
          public_key_jwk TEXT NOT NULL,
          public_key_thumbprint TEXT NOT NULL,
          active_from TEXT NOT NULL,
          active_until TEXT,
          reason TEXT
        );
        CREATE TABLE IF NOT EXISTS challenges (
          challenge_id TEXT PRIMARY KEY,
          nonce TEXT NOT NULL,
          issued_at TEXT NOT NULL,
          expires_at TEXT NOT NULL,
          consumed_at TEXT
        );
      `);
    });
  }

  enroll(record){
    const existing=this.sql.exec("SELECT * FROM enrollment WHERE slot=1").toArray()[0]||null;
    if(existing){
      if(existing.public_key_thumbprint===record.public_key_thumbprint){
        return {ok:true,idempotent:true,enrollment:this.publicEnrollment(existing)};
      }
      return {ok:false,error:"PARTICIPANT_ALREADY_ENROLLED"};
    }
    this.sql.exec(
      "INSERT INTO enrollment(slot,enrollment_id,participant_id,declared_identity,provider_or_operator,participant_class,public_key_jwk,public_key_thumbprint,enrolled_at) VALUES(1,?,?,?,?,?,?,?,?)",
      record.enrollment_id,record.participant_id,record.declared_identity,record.provider_or_operator,record.participant_class,
      JSON.stringify(record.public_key_jwk),record.public_key_thumbprint,record.enrolled_at
    );
    return {ok:true,idempotent:false,enrollment:this.publicEnrollment({...record,public_key_jwk:JSON.stringify(record.public_key_jwk)})};
  }

  rotateEnrollment(record,now){
    const existing=this.sql.exec("SELECT * FROM enrollment WHERE slot=1").toArray()[0]||null;
    if(!existing)return{ok:false,error:"PARTICIPANT_NOT_ENROLLED"};
    if(existing.public_key_thumbprint===record.public_key_thumbprint)return{ok:false,error:"NEW_KEY_EQUALS_CURRENT_KEY"};
    const rotationId="rotate:"+crypto.randomUUID();
    this.sql.exec(
      "INSERT INTO enrollment_history(rotation_id,enrollment_id,participant_id,public_key_jwk,public_key_thumbprint,active_from,active_until,reason) VALUES(?,?,?,?,?,?,?,?)",
      rotationId,existing.enrollment_id,existing.participant_id,existing.public_key_jwk,existing.public_key_thumbprint,existing.enrolled_at,now,record.reason
    );
    this.sql.exec(
      "UPDATE enrollment SET enrollment_id=?,public_key_jwk=?,public_key_thumbprint=?,enrolled_at=? WHERE slot=1",
      record.enrollment_id,JSON.stringify(record.public_key_jwk),record.public_key_thumbprint,now
    );
    const current=this.sql.exec("SELECT * FROM enrollment WHERE slot=1").one();
    return{
      ok:true,
      rotation_id:rotationId,
      previous_key_thumbprint:existing.public_key_thumbprint,
      enrollment:this.publicEnrollment(current)
    };
  }

  publicEnrollment(row){
    return {
      enrollment_id:row.enrollment_id,
      participant_id:row.participant_id,
      declared_identity:row.declared_identity,
      provider_or_operator:row.provider_or_operator||null,
      participant_class:row.participant_class,
      public_key_thumbprint:row.public_key_thumbprint,
      enrolled_at:row.enrolled_at,
      identity_state:"key_enrolled_declared_identity",
      authority_state:"none"
    };
  }

  getEnrollment(){
    const row=this.sql.exec("SELECT * FROM enrollment WHERE slot=1").toArray()[0]||null;
    if(!row)return null;
    return {...this.publicEnrollment(row),public_key_jwk:JSON.parse(row.public_key_jwk)};
  }

  issueChallenge(record){
    const enrolled=this.sql.exec("SELECT participant_id FROM enrollment WHERE slot=1").toArray()[0]||null;
    if(!enrolled)return {ok:false,error:"PARTICIPANT_NOT_ENROLLED"};
    this.sql.exec("DELETE FROM challenges WHERE expires_at < ? OR consumed_at IS NOT NULL",record.issued_at);
    this.sql.exec(
      "INSERT INTO challenges(challenge_id,nonce,issued_at,expires_at,consumed_at) VALUES(?,?,?,?,NULL)",
      record.challenge_id,record.nonce,record.issued_at,record.expires_at
    );
    return {ok:true,challenge:record};
  }

  getChallenge(challengeId){
    return this.sql.exec("SELECT * FROM challenges WHERE challenge_id=?",challengeId).toArray()[0]||null;
  }

  consumeChallenge(challengeId,now){
    const row=this.sql.exec("SELECT * FROM challenges WHERE challenge_id=?",challengeId).toArray()[0]||null;
    if(!row)return {ok:false,error:"CHALLENGE_NOT_FOUND"};
    if(row.consumed_at)return {ok:false,error:"CHALLENGE_ALREADY_CONSUMED"};
    if(Date.parse(row.expires_at)<=Date.parse(now))return {ok:false,error:"CHALLENGE_EXPIRED"};
    this.sql.exec("UPDATE challenges SET consumed_at=? WHERE challenge_id=? AND consumed_at IS NULL",now,challengeId);
    const after=this.sql.exec("SELECT consumed_at FROM challenges WHERE challenge_id=?",challengeId).one();
    if(after.consumed_at!==now)return {ok:false,error:"CHALLENGE_CONSUME_RACE"};
    return {ok:true,consumed_at:now};
  }
}

export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(request.method==="OPTIONS")return new Response(null,{status:204,headers:json({}).headers});
    if(url.pathname==="/health"&&request.method==="GET"){
      return json({
        service:"tyme-authenticated-contribution-v0",
        status:"ok",
        authority_state:"none",
        production_route:"not_attached",
        algorithm:"Ed25519",
        challenge_ttl_seconds:CHALLENGE_TTL_MS/1000
      });
    }

    if(url.pathname==="/api/v0/auth/enroll"&&request.method==="POST"){
      if(request.headers.get("x-tyme-enrollment-gate")!==env.ENROLLMENT_GATE_TOKEN){
        return json({ok:false,error:"ENROLLMENT_GATE_REQUIRED"},403);
      }
      let input;
      try{input=await request.json();}catch{return json({ok:false,error:"INVALID_JSON"},400);}
      if(typeof input.participant_id!=="string"||!input.participant_id.trim()||input.participant_id.length>160)return json({ok:false,error:"INVALID_PARTICIPANT_ID"},400);
      if(typeof input.declared_identity!=="string"||!input.declared_identity.trim()||input.declared_identity.length>120)return json({ok:false,error:"INVALID_DECLARED_IDENTITY"},400);
      if(!ALLOWED_CLASSES.has(input.participant_class))return json({ok:false,error:"INVALID_PARTICIPANT_CLASS"},400);
      if(!validateJwk(input.public_key_jwk))return json({ok:false,error:"INVALID_ED25519_JWK"},400);
      const participantId=input.participant_id.trim();
      const thumbprint=await sha256B64url(canonicalJwk(input.public_key_jwk));
      const enrollmentId="enroll:"+thumbprint.slice(0,32);
      const stub=env.PARTICIPANTS.getByName(participantId);
      const result=await stub.enroll({
        enrollment_id:enrollmentId,
        participant_id:participantId,
        declared_identity:input.declared_identity.trim(),
        provider_or_operator:typeof input.provider_or_operator==="string"&&input.provider_or_operator.trim()?input.provider_or_operator.trim().slice(0,120):null,
        participant_class:input.participant_class,
        public_key_jwk:input.public_key_jwk,
        public_key_thumbprint:thumbprint,
        enrolled_at:new Date().toISOString()
      });
      return json(result,result.ok?201:409);
    }

    if(url.pathname==="/api/v0/auth/rotate"&&request.method==="POST"){
      if(request.headers.get("x-tyme-enrollment-gate")!==env.ENROLLMENT_GATE_TOKEN){
        return json({ok:false,error:"ENROLLMENT_GATE_REQUIRED"},403);
      }
      let input;
      try{input=await request.json();}catch{return json({ok:false,error:"INVALID_JSON"},400);}
      if(typeof input.participant_id!=="string"||!input.participant_id.trim())return json({ok:false,error:"INVALID_PARTICIPANT_ID"},400);
      if(!validateJwk(input.new_public_key_jwk))return json({ok:false,error:"INVALID_ED25519_JWK"},400);
      const thumbprint=await sha256B64url(canonicalJwk(input.new_public_key_jwk));
      const stub=env.PARTICIPANTS.getByName(input.participant_id.trim());
      const result=await stub.rotateEnrollment({
        enrollment_id:"enroll:"+thumbprint.slice(0,32),
        public_key_jwk:input.new_public_key_jwk,
        public_key_thumbprint:thumbprint,
        reason:typeof input.reason==="string"?input.reason.slice(0,300):"operator-gated rotation"
      },new Date().toISOString());
      return json(result,result.ok?200:409);
    }

    if(url.pathname==="/api/v0/auth/challenges"&&request.method==="POST"){
      let input;
      try{input=await request.json();}catch{return json({ok:false,error:"INVALID_JSON"},400);}
      if(typeof input.participant_id!=="string"||!input.participant_id.trim())return json({ok:false,error:"INVALID_PARTICIPANT_ID"},400);
      const participantId=input.participant_id.trim();
      const stub=env.PARTICIPANTS.getByName(participantId);
      const enrollment=await stub.getEnrollment();
      if(!enrollment)return json({ok:false,error:"PARTICIPANT_NOT_ENROLLED"},404);
      const nonceBytes=new Uint8Array(32);crypto.getRandomValues(nonceBytes);
      const now=Date.now();
      const record={
        challenge_id:crypto.randomUUID(),
        participant_id:participantId,
        nonce:b64url(nonceBytes),
        issued_at:new Date(now).toISOString(),
        expires_at:new Date(now+CHALLENGE_TTL_MS).toISOString(),
        signing_protocol:PROTOCOL,
        signing_rule:"UTF-8 bytes of JSON.stringify({protocol,participant_id,challenge_id,nonce,payload}) with keys in that exact order"
      };
      const result=await stub.issueChallenge(record);
      return json(result,result.ok?201:409);
    }

    if(url.pathname==="/api/v0/auth/contributions"&&request.method==="POST"){
      let input;
      try{input=await request.json();}catch{return json({ok:false,error:"INVALID_JSON"},400);}
      const participantId=typeof input.participant_id==="string"?input.participant_id.trim():"";
      const challengeId=typeof input.challenge_id==="string"?input.challenge_id.trim():"";
      if(!participantId||!challengeId)return json({ok:false,error:"PARTICIPANT_AND_CHALLENGE_REQUIRED"},400);
      if(!input.signature||input.signature.algorithm!=="Ed25519"||input.signature.encoding!=="base64url"||typeof input.signature.value!=="string"){
        return json({ok:false,error:"INVALID_SIGNATURE_ENVELOPE"},400);
      }
      const payloadError=validatePayload(input.payload,participantId,challengeId);
      if(payloadError)return json({ok:false,error:"INVALID_PAYLOAD",message:payloadError},400);

      const stub=env.PARTICIPANTS.getByName(participantId);
      const enrollment=await stub.getEnrollment();
      if(!enrollment)return json({ok:false,error:"PARTICIPANT_NOT_ENROLLED"},404);
      const challenge=await stub.getChallenge(challengeId);
      if(!challenge)return json({ok:false,error:"CHALLENGE_NOT_FOUND"},404);
      const now=new Date().toISOString();
      if(challenge.consumed_at)return json({ok:false,error:"CHALLENGE_ALREADY_CONSUMED"},409);
      if(Date.parse(challenge.expires_at)<=Date.parse(now))return json({ok:false,error:"CHALLENGE_EXPIRED"},409);

      let key;
      try{
        key=await crypto.subtle.importKey("jwk",enrollment.public_key_jwk,{name:"Ed25519"},false,["verify"]);
      }catch(e){
        return json({ok:false,error:"PUBLIC_KEY_IMPORT_FAILED",message:String(e)},500);
      }
      let sigBytes;
      try{sigBytes=fromB64url(input.signature.value);}catch{return json({ok:false,error:"INVALID_SIGNATURE_ENCODING"},400);}
      const signedText=canonicalSignedObject(participantId,challengeId,challenge.nonce,input.payload);
      const verified=await crypto.subtle.verify("Ed25519",key,sigBytes,new TextEncoder().encode(signedText));
      if(!verified)return json({ok:false,error:"SIGNATURE_INVALID"},401);

      const consumed=await stub.consumeChallenge(challengeId,now);
      if(!consumed.ok)return json(consumed,409);

      let providerResolution={ok:true,state:"not_established",attestation:null};
      if(env.PROVIDER_ATTESTATION && env.PROVIDER_QUERY_TOKEN){
        try{
          const pr=await env.PROVIDER_ATTESTATION.fetch(new Request("https://provider.internal/api/v0/provider/attestations/resolve",{
            method:"POST",
            headers:{"content-type":"application/json","x-tyme-provider-query":env.PROVIDER_QUERY_TOKEN},
            body:JSON.stringify({participant_id:participantId,subject_key_thumbprint:enrollment.public_key_thumbprint})
          }));
          if(pr.ok)providerResolution=await pr.json();
        }catch{}
      }
      const identityState=providerResolution.state==="provider_attested"?"provider_attested":"cryptographically_attested";
      const providerAttestation=identityState==="provider_attested"?providerResolution.attestation:null;
      const providerRefs=providerAttestation?[
        "provider_attestation:"+providerAttestation.attestation_id,
        "provider:"+providerAttestation.provider_id,
        "provider_subject:"+providerAttestation.provider_subject
      ]:[];

      const commonsInput={
        participant:{
          participant_class:enrollment.participant_class,
          declared_identity:enrollment.declared_identity,
          provider_or_operator:enrollment.provider_or_operator
        },
        message_type:input.payload.message_type,
        content:input.payload.content,
        parent_message_id:input.payload.parent_message_id??null,
        claim_refs:normalizeRefs(input.payload.claim_refs),
        evidence_refs:normalizeRefs(input.payload.evidence_refs),
        source_refs:normalizeRefs(input.payload.source_refs),
        contradiction_refs:normalizeRefs(input.payload.contradiction_refs),
        validation_refs:normalizeRefs(input.payload.validation_refs),
        authorship:{
          author_participant_id:participantId,
          declared_author:enrollment.declared_identity,
          author_identity_state:identityState,
          source_artifact_ref:null,
          author_evidence_refs:[
            "enrollment:"+enrollment.enrollment_id,
            "challenge:"+challengeId,
            "public_key_thumbprint:"+enrollment.public_key_thumbprint,
            ...providerRefs
          ]
        },
        submission:{
          submitted_by:enrollment.declared_identity,
          submission_actor_class:enrollment.participant_class,
          submission_identity_state:identityState,
          relay_state:"direct",
          relay_method:"Direct signed submission through TYME authenticated-contribution gateway.",
          relay_evidence_refs:[
            "challenge:"+challengeId,
            "public_key_thumbprint:"+enrollment.public_key_thumbprint,
            ...providerRefs
          ]
        },
        verified_identity:{
          verification_state:"signature_verified",
          identity_state:identityState,
          provider_attestation_id:providerAttestation?.attestation_id||null,
          participant_id:participantId,
          challenge_id:challengeId,
          enrollment_id:enrollment.enrollment_id,
          identity_evidence_refs:[
            "enrollment:"+enrollment.enrollment_id,
            "challenge:"+challengeId,
            "public_key_thumbprint:"+enrollment.public_key_thumbprint
          ]
        }
      };

      const internal=new Request("https://commons.internal/api/v0/threads/"+THREAD_ID+"/messages",{
        method:"POST",
        headers:{
          "content-type":"application/json",
          "origin":"https://collaboration-hall-commons-b.codex-interface-83q.pages.dev",
          "x-tyme-auth-gateway-token":env.AUTH_GATEWAY_TOKEN
        },
        body:JSON.stringify(commonsInput)
      });
      const upstream=await env.COMMONS.fetch(internal);
      const upstreamBody=await upstream.json();
      if(!upstream.ok){
        return json({
          ok:false,
          error:"COMMONS_FORWARD_FAILED",
          commons_status:upstream.status,
          commons_response:upstreamBody,
          challenge_consumed:true,
          identity_state:identityState,
          provider_attestation:providerAttestation?{
            attestation_id:providerAttestation.attestation_id,
            provider_id:providerAttestation.provider_id,
            provider_subject:providerAttestation.provider_subject,
            model_id:providerAttestation.model_id,
            runtime_id:providerAttestation.runtime_id,
            expires_at:providerAttestation.expires_at
          }:null
        },502);
      }
      return json({
        ok:true,
        verification:{
          state:"signature_verified",
          algorithm:"Ed25519",
          participant_id:participantId,
          enrollment_id:enrollment.enrollment_id,
          public_key_thumbprint:enrollment.public_key_thumbprint,
          challenge_id:challengeId,
          challenge_consumed:true
        },
        commons:upstreamBody,
        authority_state:"none",
        institutional_effect:"none"
      },201);
    }

    return json({ok:false,error:"NOT_FOUND"},404);
  }
};