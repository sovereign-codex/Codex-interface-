# TYME-REAL-PROVIDER-ATTESTATION-001

**Status:** Research-grounded candidate specification  
**Date:** 2026-11-08  
**Authority:** Non-authorizing  
**Runtime deployment:** Not yet established

## Purpose

Translate real provider identity surfaces into TYME provider-attestation adapters without promoting account credentials, transport identity, workload identity, or application identity into unsupported model/session claims.

## Critical refinement

`provider_attested` MUST carry an explicit `attestation_scope`.

Recommended scopes:

- `provider_transport_client`
- `provider_account_principal`
- `provider_workload_principal`
- `provider_agent_principal`
- `provider_app_installation`
- `provider_model_runtime`
- `provider_session`
- `unknown`

An adapter MUST also declare attestation direction:

- `provider_to_tyme`
- `client_to_provider`
- `bidirectional`
- `metadata_only`
- `unknown`

## Governing invariant

> **provider identity at one layer does not silently become model identity at another layer.**

Examples:

- OpenAI-managed mTLS can establish that an MCP client connection came from ChatGPT infrastructure. It does not by itself identify the exact GPT model or conversation.
- A Google service-account OIDC token can establish a Google workload principal. It does not by itself identify a consumer Gemini chat session.
- Anthropic WIF establishes a workload to Anthropic and maps it to an Anthropic service account. It is not automatically an Anthropic-to-TYME model attestation.
- xAI mTLS authenticates a customer client to xAI. It is not an xAI-signed Grok identity assertion to TYME.

## Provider findings

### OpenAI / ChatGPT — strongest immediate adapter

OpenAI documents two provider-controlled ChatGPT MCP client-identity surfaces:

1. OpenAI-managed mTLS client certificate presented by ChatGPT to MCP servers.
2. CIMD client identity, with optional `private_key_jwt` signed against an OpenAI-published JWKS.

TYME can therefore build an adapter that establishes:

`attestation_scope = provider_transport_client`

for ChatGPT MCP traffic.

This is currently the strongest real provider-to-TYME attestation candidate.

OpenAI API / Codex workload identity federation is also strong, but its direction is primarily workload-to-OpenAI: external OIDC/SPIFFE/X.509 identity is verified by OpenAI and exchanged for a short-lived OpenAI access token. That does not automatically give TYME a model/session assertion.

### Google / Gemini — strong workload and agent identity

Gemini API authorization keys are bound to Google Cloud service accounts. Google service accounts can produce short-lived OIDC identity tokens, and Google IAM can sign JWTs.

Gemini Enterprise Agent Platform documents agent identities backed by SPIFFE X.509, OIDC ID tokens, 2LO credentials, or API keys, with audit attribution for agent and delegated user identities.

TYME can therefore support Google-signed workload/agent identity when that identity directly calls TYME.

The current consumer Gemini app / Google AI Mode does not expose a specific Gemini model/session attestation to TYME. Our Google-Lens retrieval telemetry remains transport/provider evidence only.

### Anthropic / Claude — strong inward workload identity, no outward model attestation found

Anthropic supports identity-backed personal/service-account keys, Workload Identity Federation, and Apple App Attest.

Those are strong authentication surfaces for clients authenticating to Anthropic.

As of this review, no Anthropic-documented surface was found that exports a Claude model/session identity assertion for an arbitrary external service such as TYME to verify.

Therefore the initial Anthropic adapter should remain evidence-only unless a provider-to-TYME assertion surface is documented.

### xAI / Grok — strong account/client authentication, no outward model attestation found

xAI API keys are bound to teams and associated with their creating user in management records.

xAI also supports enterprise mTLS in which xAI validates a customer client certificate in addition to the API key.

These authenticate the client to xAI. They do not establish an xAI-signed Grok model/session assertion to TYME.

The initial xAI adapter should remain evidence-only.

### Local/open models

No upstream provider attestation exists by default. TYME should continue to use enrolled signing keys and optionally layer workload/hardware identity such as SPIFFE, TPM/TEE, App Attest, or operator attestation.

## Ranked implementation order

1. `OPENAI-CHATGPT-MCP-ATTESTATION-001`
2. `GOOGLE-AGENT-WORKLOAD-ATTESTATION-001`
3. `ANTHROPIC-PRINCIPAL-EVIDENCE-001`
4. `XAI-PRINCIPAL-EVIDENCE-001`

## Authority boundary

No adapter may grant Hall authority.

> **provider_attested(scope=X) != institutional authority**
