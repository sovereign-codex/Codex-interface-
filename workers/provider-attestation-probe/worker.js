function b64url(bytes){
  let s="";for(const b of bytes)s+=String.fromCharCode(b);
  return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function canonicalJwk(jwk){return JSON.stringify({crv:"Ed25519",kty:"OKP",x:jwk.x});}
async function sha256B64url(text){
  return b64url(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text))));
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
function canonicalProviderAttestation(attestation){
  return JSON.stringify({protocol:"TYME-PROVIDER-ATTESTATION-001",attestation});
}
async function post(service,path,body,headers={}){
  const r=await service.fetch(new Request("https://internal"+path,{
    method:"POST",
    headers:{"content-type":"application/json",...headers},
    body:JSON.stringify(body)
  }));
  let j;try{j=await r.json();}catch{j={raw:await r.text()};}
  return {status:r.status,body:j};
}
async function enrollParticipant(env,participantId,declaredIdentity,kp){
  const jwk=await crypto.subtle.exportKey("jwk",kp.publicKey);
  return post(env.AUTH,"/api/v0/auth/enroll",{
    participant_id:participantId,
    declared_identity:declaredIdentity,
    provider_or_operator:"Synthetic Provider Lab",
    participant_class:"observer",
    public_key_jwk:jwk
  },{"x-tyme-enrollment-gate":env.ENROLLMENT_GATE_TOKEN});
}
async function rotateParticipant(env,participantId,kp,reason){
  const jwk=await crypto.subtle.exportKey("jwk",kp.publicKey);
  return post(env.AUTH,"/api/v0/auth/rotate",{
    participant_id:participantId,
    new_public_key_jwk:jwk,
    reason
  },{"x-tyme-enrollment-gate":env.ENROLLMENT_GATE_TOKEN});
}
async function contribute(env,participantId,kp,label){
  const ch=await post(env.AUTH,"/api/v0/auth/challenges",{participant_id:participantId});
  if(ch.status!==201)return{ok:false,stage:"challenge",ch};
  const challenge=ch.body.challenge;
  const payload={
    schema_version:"0.1",
    participant_id:participantId,
    challenge_id:challenge.challenge_id,
    thread_id:"commons-bootstrap-001",
    parent_message_id:null,
    message_type:"validation_request",
    content:"TYME-PROVIDER-ATTESTATION-001 synthetic probe: "+label,
    claim_refs:["TYME-PROVIDER-ATTESTATION-001","probe:"+label],
    evidence_refs:[],
    source_refs:[],
    contradiction_refs:[],
    validation_refs:["provider-attestation","rotation","revocation"]
  };
  const signed=canonicalSignedObject(participantId,challenge.challenge_id,challenge.nonce,payload);
  const sig=new Uint8Array(await crypto.subtle.sign("Ed25519",kp.privateKey,new TextEncoder().encode(signed)));
  const res=await post(env.AUTH,"/api/v0/auth/contributions",{
    participant_id:participantId,
    challenge_id:challenge.challenge_id,
    payload,
    signature:{algorithm:"Ed25519",encoding:"base64url",value:b64url(sig)}
  });
  return{ok:res.status===201,res,challenge};
}
async function enrollProviderKey(env,providerId,providerName,keyId,kp){
  const jwk=await crypto.subtle.exportKey("jwk",kp.publicKey);
  return post(env.PROVIDER,"/api/v0/provider/keys/enroll",{
    provider_id:providerId,
    provider_name:providerName,
    key_id:keyId,
    public_key_jwk:jwk
  },{"x-tyme-provider-admin":env.PROVIDER_ADMIN_TOKEN});
}
async function rotateProviderKey(env,providerId,providerName,retireKeyId,newKeyId,kp){
  const jwk=await crypto.subtle.exportKey("jwk",kp.publicKey);
  return post(env.PROVIDER,"/api/v0/provider/keys/rotate",{
    provider_id:providerId,
    provider_name:providerName,
    retire_key_id:retireKeyId,
    new_key_id:newKeyId,
    new_public_key_jwk:jwk
  },{"x-tyme-provider-admin":env.PROVIDER_ADMIN_TOKEN});
}
async function issueAttestation(env,providerId,providerKeyId,providerKp,participantId,participantKp,attestationId,subjectSuffix){
  const participantJwk=await crypto.subtle.exportKey("jwk",participantKp.publicKey);
  const thumb=await sha256B64url(canonicalJwk(participantJwk));
  const now=Date.now();
  const attestation={
    schema_version:"0.1",
    attestation_id:attestationId,
    provider_id:providerId,
    provider_key_id:providerKeyId,
    subject_participant_id:participantId,
    subject_key_thumbprint:thumb,
    provider_subject:"synthetic-subject:"+subjectSuffix,
    model_id:"synthetic-model-v1",
    runtime_id:"synthetic-runtime-"+subjectSuffix,
    session_ref:"synthetic-session-"+subjectSuffix,
    issued_at:new Date(now).toISOString(),
    not_before:new Date(now-1000).toISOString(),
    expires_at:new Date(now+10*60*1000).toISOString(),
    assurance_level:"provider_signed_key_binding",
    claims:{synthetic:true,test_only:true}
  };
  const sig=new Uint8Array(await crypto.subtle.sign("Ed25519",providerKp.privateKey,new TextEncoder().encode(canonicalProviderAttestation(attestation))));
  const res=await post(env.PROVIDER,"/api/v0/provider/attestations",{
    attestation,
    signature:{algorithm:"Ed25519",encoding:"base64url",value:b64url(sig)}
  });
  return{res,attestation,participant_key_thumbprint:thumb};
}

export default{
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname!=="/run")return Response.json({ok:false,error:"NOT_FOUND"},{status:404});
    try{
      const providerId="synthetic-provider:"+crypto.randomUUID();
      const providerName="TYME Synthetic Provider";
      const providerKey1=await crypto.subtle.generateKey("Ed25519",true,["sign","verify"]);
      const providerKey2=await crypto.subtle.generateKey("Ed25519",true,["sign","verify"]);
      const participantKey1=await crypto.subtle.generateKey("Ed25519",true,["sign","verify"]);
      const participantKey2=await crypto.subtle.generateKey("Ed25519",true,["sign","verify"]);
      const participantId="provider-probe:"+crypto.randomUUID();
      const declaredIdentity="Synthetic Provider Participant";

      const root1=await enrollProviderKey(env,providerId,providerName,"provider-key-1",providerKey1);
      const enrollment=await enrollParticipant(env,participantId,declaredIdentity,participantKey1);
      if(root1.status!==201||enrollment.status!==201){
        return Response.json({verdict:"ERROR",stage:"initial_enrollment",root1,enrollment},{status:500});
      }

      const attA=await issueAttestation(env,providerId,"provider-key-1",providerKey1,participantId,participantKey1,"att-A:"+crypto.randomUUID(),"A");
      const c1=await contribute(env,participantId,participantKey1,"provider-attested-before-rotation");

      const root2=await rotateProviderKey(env,providerId,providerName,"provider-key-1","provider-key-2",providerKey2);
      const c2=await contribute(env,participantId,participantKey1,"provider-attested-after-provider-key-rotation");

      const revokeA=await post(env.PROVIDER,"/api/v0/provider/attestations/revoke",{
        participant_id:participantId,
        attestation_id:attA.attestation.attestation_id,
        reason:"synthetic revocation test"
      },{"x-tyme-provider-admin":env.PROVIDER_ADMIN_TOKEN});
      const c3=await contribute(env,participantId,participantKey1,"crypto-only-after-attestation-revocation");

      const participantRotation=await rotateParticipant(env,participantId,participantKey2,"synthetic participant-key rotation");
      const c4=await contribute(env,participantId,participantKey2,"crypto-only-after-participant-key-rotation");

      const attB=await issueAttestation(env,providerId,"provider-key-2",providerKey2,participantId,participantKey2,"att-B:"+crypto.randomUUID(),"B");
      const c5=await contribute(env,participantId,participantKey2,"provider-attested-after-new-key-attestation");

      const revokeProvider2=await post(env.PROVIDER,"/api/v0/provider/keys/revoke",{
        provider_id:providerId,
        key_id:"provider-key-2",
        reason:"synthetic provider-key revocation test"
      },{"x-tyme-provider-admin":env.PROVIDER_ADMIN_TOKEN});
      const c6=await contribute(env,participantId,participantKey2,"crypto-only-after-provider-key-revocation");

      const states=[c1,c2,c3,c4,c5,c6].map(x=>x.res?.body?.verification?.identity_state||null);
      const commonsStates=[c1,c2,c3,c4,c5,c6].map(x=>x.res?.body?.commons?.message?.participant?.authentication_state||null);
      const sequences=[c1,c2,c3,c4,c5,c6].map(x=>x.res?.body?.commons?.receipt?.sequence??null);

      const checks={
        provider_root_enrolled:root1.status===201&&root1.body?.ok===true,
        participant_enrolled:enrollment.status===201&&enrollment.body?.ok===true,
        attestation_A_verified:attA.res.status===201&&attA.res.body?.signature_state==="verified",
        provider_attested_before_rotation:states[0]==="provider_attested"&&commonsStates[0]==="provider_attested",
        provider_key_rotated:root2.status===201&&root2.body?.ok===true,
        retired_provider_key_preserves_valid_attestation:states[1]==="provider_attested"&&commonsStates[1]==="provider_attested",
        attestation_revoked:revokeA.status===200&&revokeA.body?.ok===true,
        revocation_downgrades_to_crypto:states[2]==="cryptographically_attested"&&commonsStates[2]==="cryptographically_attested",
        participant_key_rotated:participantRotation.status===200&&participantRotation.body?.ok===true,
        stale_attestation_does_not_transfer_to_rotated_participant_key:states[3]==="cryptographically_attested"&&commonsStates[3]==="cryptographically_attested",
        attestation_B_verified:attB.res.status===201&&attB.res.body?.signature_state==="verified",
        rotated_participant_key_upgrades_after_fresh_attestation:states[4]==="provider_attested"&&commonsStates[4]==="provider_attested",
        provider_key_revoked:revokeProvider2.status===200&&revokeProvider2.body?.ok===true,
        provider_key_revocation_downgrades_to_crypto:states[5]==="cryptographically_attested"&&commonsStates[5]==="cryptographically_attested",
        all_contributions_persisted:[c1,c2,c3,c4,c5,c6].every(x=>x.res?.status===201&&x.res?.body?.commons?.receipt?.persistence_state==="persisted"),
        authority_never_promoted:[c1,c2,c3,c4,c5,c6].every(x=>x.res?.body?.commons?.message?.authority_state==="advisory_only")
      };
      const pass=Object.values(checks).every(Boolean);
      return Response.json({
        artifact:"TYME-PROVIDER-ATTESTATION-001-PROBE",
        verdict:pass?"PASS":"FAIL",
        synthetic_provider:true,
        provider_id:providerId,
        participant_id:participantId,
        attestations:{
          A:{id:attA.attestation.attestation_id,key_thumbprint:attA.participant_key_thumbprint},
          B:{id:attB.attestation.attestation_id,key_thumbprint:attB.participant_key_thumbprint}
        },
        identity_states:states,
        commons_identity_states:commonsStates,
        sequences,
        checks,
        authority_state:"none",
        institutional_effect:"none",
        proof_ceiling:"Mechanism-only synthetic provider attestation. No real provider identity is claimed."
      },{status:pass?200:500});
    }catch(e){
      return Response.json({verdict:"ERROR",error:String(e),authority_state:"none",institutional_effect:"none"},{status:500});
    }
  }
};