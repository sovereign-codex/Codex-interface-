function b64url(bytes){
  let s="";for(const b of bytes)s+=String.fromCharCode(b);
  return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function jsonB64url(obj){
  return b64url(new TextEncoder().encode(JSON.stringify(obj)));
}
async function call(env,path,body,headers={}){
  const r=await env.ADAPTER.fetch(new Request("https://adapter.internal"+path,{
    method:body===undefined?"GET":"POST",
    headers:{"content-type":"application/json",...headers},
    body:body===undefined?undefined:JSON.stringify(body)
  }));
  let j;try{j=await r.json();}catch{j={raw:await r.text()};}
  return {status:r.status,body:j};
}
export default{
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname!=="/run")return Response.json({ok:false,error:"NOT_FOUND"},{status:404});
    try{
      const metadata=await call(env,"/api/v0/openai/client-metadata");
      if(metadata.status!==200||metadata.body?.ok!==true){
        return Response.json({verdict:"ERROR",stage:"live_metadata",metadata},{status:500});
      }

      const kp=await crypto.subtle.generateKey(
        {name:"RSASSA-PKCS1-v1_5",modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:"SHA-256"},
        true,["sign","verify"]
      );
      const jwk=await crypto.subtle.exportKey("jwk",kp.publicKey);
      jwk.kid="synthetic-rs256-key";
      jwk.use="sig";
      jwk.alg="RS256";

      const now=Math.floor(Date.now()/1000);
      const clientId="https://chatgpt.com/oauth/client.json";
      const issuer="https://tyme-auth-test.local";
      const tokenEndpoint=issuer+"/token";
      const jti=crypto.randomUUID();
      const header={alg:"RS256",kid:jwk.kid,typ:"JWT"};
      const claims={
        iss:clientId,
        sub:clientId,
        aud:issuer,
        iat:now,
        exp:now+300,
        jti
      };
      const signingInput=jsonB64url(header)+"."+jsonB64url(claims);
      const sig=new Uint8Array(await crypto.subtle.sign(
        {name:"RSASSA-PKCS1-v1_5"},
        kp.privateKey,
        new TextEncoder().encode(signingInput)
      ));
      const jwt=signingInput+"."+b64url(sig);

      const body={
        client_assertion:jwt,
        jwks:{keys:[jwk]},
        expected_client_id:clientId,
        authorization_server_issuer:issuer,
        token_endpoint:tokenEndpoint,
        binding_context:{participant_id:"openai-adapter-probe",connection_id:"synthetic-oauth-connection"}
      };
      const first=await call(env,"/api/v0/test/verify-client-assertion",body,{"x-tyme-test-token":env.TEST_PROBE_TOKEN});
      const replay=await call(env,"/api/v0/test/verify-client-assertion",body,{"x-tyme-test-token":env.TEST_PROBE_TOKEN});

      const badClaims={...claims,aud:"https://wrong.example"};
      const badInput=jsonB64url(header)+"."+jsonB64url(badClaims);
      const badSig=new Uint8Array(await crypto.subtle.sign(
        {name:"RSASSA-PKCS1-v1_5"},kp.privateKey,new TextEncoder().encode(badInput)
      ));
      const badJwt=badInput+"."+b64url(badSig);
      const bad=await call(env,"/api/v0/test/verify-client-assertion",{
        ...body,client_assertion:badJwt
      },{"x-tyme-test-token":env.TEST_PROBE_TOKEN});

      const checks={
        live_cimd_valid:metadata.body.client_id==="https://chatgpt.com/oauth/client.json",
        live_private_key_jwt_supported:Array.isArray(metadata.body.token_endpoint_auth_methods_supported)&&metadata.body.token_endpoint_auth_methods_supported.includes("private_key_jwt"),
        live_rs256:metadata.body.token_endpoint_auth_signing_alg==="RS256",
        live_jwks_has_key:Array.isArray(metadata.body.jwks_kids)&&metadata.body.jwks_kids.length>=1,
        synthetic_assertion_accepted:first.status===201&&first.body?.ok===true&&first.body?.state==="provider_attested",
        scope_transport_client:first.body?.attestation?.attestation_scope==="provider_transport_client",
        model_not_established:first.body?.attestation?.model_runtime_state==="not_established",
        session_not_established:first.body?.attestation?.session_state==="not_established",
        authority_none:first.body?.attestation?.institutional_authority_state==="none",
        replay_rejected:replay.status===409&&replay.body?.error==="ASSERTION_REPLAY",
        wrong_audience_rejected:bad.status===401&&String(bad.body?.message||"").includes("JWT_AUD_MISMATCH")
      };
      const pass=Object.values(checks).every(Boolean);
      return Response.json({
        artifact:"OPENAI-CHATGPT-MCP-ATTESTATION-001-PROBE",
        verdict:pass?"PASS":"FAIL",
        live_metadata:{
          client_id:metadata.body.client_id,
          client_name:metadata.body.client_name,
          signing_alg:metadata.body.token_endpoint_auth_signing_alg,
          jwks_kids:metadata.body.jwks_kids,
          client_document_digest:metadata.body.client_document_digest,
          jwks_document_digest:metadata.body.jwks_document_digest
        },
        synthetic_acceptance:{
          first_status:first.status,
          attestation:first.body?.attestation||null
        },
        replay:{status:replay.status,error:replay.body?.error||null},
        wrong_audience:{status:bad.status,error:bad.body?.error||null,message:bad.body?.message||null},
        checks,
        real_openai_assertion_executed:false,
        real_openai_assertion_state:"not_established_until_actual_chatgpt_oauth_exchange",
        authority_state:"none",
        institutional_effect:"none"
      },{status:pass?200:500});
    }catch(e){
      return Response.json({verdict:"ERROR",error:String(e),authority_state:"none",institutional_effect:"none"},{status:500});
    }
  }
};