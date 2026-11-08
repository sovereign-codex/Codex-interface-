function b64url(bytes){
  let s="";for(const b of bytes)s+=String.fromCharCode(b);
  return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function canonicalSignedObject(participantId,challengeId,nonce,payload){
  return JSON.stringify({
    protocol:"TYME-AUTHENTICATED-CONTRIBUTION-001",
    participant_id:participantId,
    challenge_id:challengeId,
    nonce,
    payload
  });
}
async function call(env,path,body,headers={}){
  const r=await env.AUTH.fetch(new Request("https://auth.internal"+path,{
    method:"POST",
    headers:{"content-type":"application/json",...headers},
    body:JSON.stringify(body)
  }));
  let j;try{j=await r.json();}catch{j={raw:await r.text()};}
  return {status:r.status,body:j};
}
export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname!=="/run")return Response.json({ok:false,error:"NOT_FOUND"},{status:404});
    try{
      const kp=await crypto.subtle.generateKey("Ed25519",true,["sign","verify"]);
      const publicJwk=await crypto.subtle.exportKey("jwk",kp.publicKey);
      const participantId="probe:"+crypto.randomUUID();
      const declaredIdentity="TYME Auth Probe";
      const enroll=await call(env,"/api/v0/auth/enroll",{
        participant_id:participantId,
        declared_identity:declaredIdentity,
        provider_or_operator:"TYME validation",
        participant_class:"observer",
        public_key_jwk:publicJwk
      },{"x-tyme-enrollment-gate":env.ENROLLMENT_GATE_TOKEN});
      if(enroll.status!==201)return Response.json({ok:false,stage:"enroll",enroll},{status:500});

      const challenge=await call(env,"/api/v0/auth/challenges",{participant_id:participantId});
      if(challenge.status!==201)return Response.json({ok:false,stage:"challenge",challenge},{status:500});
      const ch=challenge.body.challenge;

      const payload={
        schema_version:"0.1",
        participant_id:participantId,
        challenge_id:ch.challenge_id,
        thread_id:"commons-bootstrap-001",
        parent_message_id:null,
        message_type:"validation_request",
        content:"TYME-AUTHENTICATED-CONTRIBUTION-001 probe: direct Ed25519-signed contribution.",
        claim_refs:["TYME-AUTHENTICATED-CONTRIBUTION-001","probe-run:AUTH-001"],
        evidence_refs:[],
        source_refs:[],
        contradiction_refs:[],
        validation_refs:["signature-verification","challenge-replay"]
      };
      const signedText=canonicalSignedObject(participantId,ch.challenge_id,ch.nonce,payload);
      const signature=new Uint8Array(await crypto.subtle.sign("Ed25519",kp.privateKey,new TextEncoder().encode(signedText)));
      const envelope={
        participant_id:participantId,
        challenge_id:ch.challenge_id,
        payload,
        signature:{algorithm:"Ed25519",encoding:"base64url",value:b64url(signature)}
      };

      const contribution=await call(env,"/api/v0/auth/contributions",envelope);
      const replay=await call(env,"/api/v0/auth/contributions",envelope);
      const m=contribution.body?.commons?.message;
      const receipt=contribution.body?.commons?.receipt;
      const checks={
        enrollment_created:enroll.status===201&&enroll.body?.ok===true,
        challenge_issued:challenge.status===201&&challenge.body?.ok===true,
        contribution_persisted:contribution.status===201&&contribution.body?.ok===true&&receipt?.persistence_state==="persisted",
        signature_verified:contribution.body?.verification?.state==="signature_verified",
        participant_crypto_attested:m?.participant?.authentication_state==="cryptographically_attested",
        signature_state_verified:m?.signature_state==="verified",
        authorship_crypto_attested:m?.authorship?.author_identity_state==="cryptographically_attested",
        submission_crypto_attested:m?.submission?.submission_identity_state==="cryptographically_attested",
        relay_direct:m?.submission?.relay_state==="direct",
        authority_advisory:m?.authority_state==="advisory_only",
        institutional_effect_none:contribution.body?.institutional_effect==="none",
        replay_rejected:replay.status===409&&replay.body?.error==="CHALLENGE_ALREADY_CONSUMED"
      };
      const pass=Object.values(checks).every(Boolean);
      return Response.json({
        artifact:"TYME-AUTHENTICATED-CONTRIBUTION-001-PROBE",
        verdict:pass?"PASS":"FAIL",
        participant_id:participantId,
        enrollment:enroll.body?.enrollment,
        challenge:{challenge_id:ch.challenge_id,expires_at:ch.expires_at},
        contribution:{
          verification:contribution.body?.verification,
          message:m,
          receipt
        },
        replay:{status:replay.status,error:replay.body?.error},
        checks,
        authority_state:"none",
        institutional_effect:"none"
      },{status:pass?200:500});
    }catch(e){
      return Response.json({ok:false,verdict:"ERROR",error:String(e)},{status:500});
    }
  }
};