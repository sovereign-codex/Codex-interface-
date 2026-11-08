# OPENAI-CHATGPT-MCP-ATTESTATION-001

**Status:** RUNTIME READY / LIVE OPENAI ASSERTION PENDING  
**Provider:** OpenAI  
**Product:** ChatGPT  
**Scope:** `provider_transport_client`  
**Authority:** None  
**Institutional effect:** None

## Live provider metadata

The adapter successfully retrieved and validated the current production ChatGPT client metadata and JWKS.

```text
client_id:
https://chatgpt.com/oauth/client.json

client_name:
ChatGPT

token_endpoint_auth:
private_key_jwt

signing_alg:
RS256

jwks:
https://chatgpt.com/oauth/jwks.json

current kid:
cimd-20260428030119
```

## Acceptance probe

The same verifier path was exercised with a synthetic RSA signing key and standards-shaped private-key JWT.

All checks passed:

- live CIMD retrieval;
- live OpenAI JWKS retrieval;
- exact ChatGPT client ID checks;
- RS256 signature verification;
- issuer / subject validation;
- bounded expiry validation;
- exact-audience validation;
- `provider_transport_client` scope;
- model runtime remains `not_established`;
- session remains `not_established`;
- authority remains `none`;
- replay rejected with `ASSERTION_REPLAY`;
- wrong audience rejected with `JWT_AUD_MISMATCH`.

## Remaining decisive gate

No real OpenAI-signed client assertion has yet been observed by this TYME adapter.

That requires ChatGPT to perform an actual OAuth token exchange against a TYME MCP authorization server.

Therefore the strongest current state is:

```text
adapter_runtime: ready
live_openai_metadata: verified
production_verifier: acceptance-tested
real_openai_signed_assertion: not_established
```

## Proof ceiling

This work demonstrates readiness to verify OpenAI-controlled ChatGPT transport identity.

It does **not** establish:

- a specific GPT model;
- a specific ChatGPT conversation/session;
- the user's identity;
- institutional authority.

> **OpenAI-authenticated ChatGPT transport != specific GPT model/session != institutional authority**
