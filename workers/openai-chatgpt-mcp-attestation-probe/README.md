# OpenAI ChatGPT MCP Attestation Probe

One-use probe for `OPENAI-CHATGPT-MCP-ATTESTATION-001`.

It checks:
- live OpenAI ChatGPT CIMD retrieval;
- live OpenAI JWKS retrieval;
- RS256 verification using the adapter's exact verifier;
- exact client ID checks;
- transport-client attestation scope;
- model/session non-promotion;
- JWT replay rejection;
- wrong-audience rejection.

Synthetic RSA keys are used for acceptance testing. A real OpenAI-signed client assertion remains not established until ChatGPT performs an actual OAuth token exchange with a TYME MCP authorization server.
