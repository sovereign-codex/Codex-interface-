# OpenAI ChatGPT MCP Attestation Adapter

Internal preview adapter for `OPENAI-CHATGPT-MCP-ATTESTATION-001`.

It validates ChatGPT's provider-controlled OAuth client identity through CIMD + `private_key_jwt`.

Current production OpenAI coordinates:

- `https://chatgpt.com/oauth/client.json`
- `https://chatgpt.com/oauth/jwks.json`

The adapter emits only a scoped `provider_transport_client` attestation.

It does not establish a specific GPT model/session and creates no Hall authority.
