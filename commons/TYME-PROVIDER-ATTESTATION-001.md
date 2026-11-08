# TYME-PROVIDER-ATTESTATION-001

**Status:** EXECUTED PASS  
**Provider:** Synthetic test provider only  
**Authority:** None  
**Institutional effect:** None  
**Production route:** Not established

## Result

The bounded provider-attestation lifecycle passed end to end.

Identity-state progression:

```text
sequence 4 -> provider_attested
sequence 5 -> provider_attested
sequence 6 -> cryptographically_attested
sequence 7 -> cryptographically_attested
sequence 8 -> provider_attested
sequence 9 -> cryptographically_attested
```

## Lifecycle exercised

1. Trusted synthetic provider root enrolled.
2. Participant Ed25519 key enrolled.
3. Provider signed an attestation binding its identity claim to that exact participant key thumbprint.
4. Direct contribution persisted as `provider_attested`.
5. Provider signing key rotated; the retired key still supported the previously issued valid attestation.
6. Individual attestation revoked; the participant downgraded to `cryptographically_attested`.
7. Participant key rotated; the old provider attestation did not transfer to the new key.
8. Fresh attestation for the rotated participant key restored `provider_attested`.
9. Provider signing key was revoked; the participant again downgraded to cryptographic-only.
10. Every contribution persisted and remained `advisory_only`.

## Boundary

No public provider-attestation surface exists.

- provider-attestation workers.dev subdomain: disabled
- authenticated-contribution workers.dev subdomain: disabled
- synthetic probe workers.dev subdomain: disabled
- no `tymehall.org` route points to either identity service

The only production Worker routes remain the read-only Evidence Bridge and Machine Gateway.

## Proof ceiling

This is a **mechanism-only** provider-attestation proof using a synthetic provider.

It does not establish a real provider identity or claim that Google, xAI, OpenAI, Anthropic, or any other vendor currently issues a compatible attestation.

> **provider_attested identity != institutional authority**
