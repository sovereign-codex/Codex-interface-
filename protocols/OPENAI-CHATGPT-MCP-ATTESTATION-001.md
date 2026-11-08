# OPENAI-CHATGPT-MCP-ATTESTATION-001

**Status:** Runtime ready — live OpenAI assertion pending  
**Provider:** OpenAI  
**Product surface:** ChatGPT MCP / plugin client  
**Attestation scope:** `provider_transport_client`  
**Attestation direction:** `provider_to_tyme`  
**Authority:** None  
**Production Hall route:** Not established

## Purpose

Verify a provider-controlled ChatGPT client identity signal without promoting that signal to a specific GPT model, conversation, session, or Hall authority.

## Provider-controlled evidence

OpenAI's current production CIMD is:

`https://chatgpt.com/oauth/client.json`

It declares:

- client name: ChatGPT;
- stable client ID: the CIMD URL;
- `private_key_jwt` support;
- RS256 token-endpoint client-auth signing;
- JWKS: `https://chatgpt.com/oauth/jwks.json`.

The adapter refetches and validates those documents at verification time.

## Verification sequence

```text
ChatGPT OAuth token request
  ->
client_assertion (private_key_jwt)
  ->
fetch current ChatGPT CIMD
  ->
fetch current OpenAI JWKS
  ->
match kid / RS256
  ->
verify signature
  ->
verify iss == sub == ChatGPT client_id
  ->
verify exp / iat / nbf
  ->
verify exact audience
  ->
consume assertion replay key
  ->
store scoped provider attestation evidence
```

## Audience policy

The adapter recognizes two exact profiles during the interoperability transition:

- `rfc10070_issuer`: sole audience is the authorization-server issuer identifier.
- `rfc7523_legacy_token_endpoint`: sole audience is the exact token endpoint URL.

Any other audience is rejected.

Once a live ChatGPT exchange establishes the actual production behavior for this TYME authorization server, the policy SHOULD be tightened to the observed standards-conformant profile.

## Replay policy

A JWT `jti` is used when present.

If `jti` is absent, the SHA-256 digest of the entire signed JWT becomes the replay key.

The same assertion cannot be accepted twice during its validity window.

## TYME binding boundary

The OpenAI assertion covers the ChatGPT OAuth client identity.

TYME may bind the verified transport client to:

- a TYME participant ID;
- a TYME OAuth connection ID.

That binding is performed by TYME and MUST remain explicitly marked:

`provider_signed: false`

It is not an OpenAI assertion about the participant.

## Proof ceiling

A PASS may establish:

> An OAuth/MCP client assertion was signed by a key currently published in ChatGPT's OpenAI-controlled CIMD/JWKS and satisfied the declared OAuth client-authentication checks.

A PASS MUST NOT establish:

- the exact GPT model;
- the exact ChatGPT conversation;
- the exact model runtime;
- the end user's identity;
- institutional authority.

## mTLS

OpenAI also documents an OpenAI-managed ChatGPT mTLS client certificate with SAN:

`mtls.prod.connectors.openai.com`

mTLS is treated as a second provider-controlled transport signal. It is not required for the first portable adapter implementation because edge trust of OpenAI's CA depends on hosting/CA configuration.

## Governing invariant

> **OpenAI-authenticated ChatGPT transport != specific GPT model/session != institutional authority**


---

## Executed adapter acceptance probe

The internal adapter runtime successfully:

- retrieved live ChatGPT CIMD;
- retrieved live OpenAI JWKS;
- verified RS256 private-key JWTs through the production verifier path;
- rejected replayed assertions;
- rejected incorrect audiences;
- preserved `provider_transport_client` scope;
- preserved model/session as `not_established`;
- preserved authority as `none`.

A real OpenAI-signed ChatGPT assertion remains pending an actual OAuth exchange with a TYME MCP authorization server.
