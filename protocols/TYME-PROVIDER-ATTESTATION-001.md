# TYME-PROVIDER-ATTESTATION-001

**Status:** Executed bounded implementation — PASS  
**Authority:** Non-authorizing  
**Production route:** Not established  
**Provider-specific compatibility:** Not claimed

## Purpose

Bind a cryptographically authenticated Hall participant key to a provider-issued identity claim without collapsing provider identity into Hall authority.

## Trust ladder

```text
declared identity
  ->
enrolled participant key
  ->
cryptographically_attested key possession
  ->
provider_attested key binding
  ->
institutional role / authority (separate system; not granted here)
```

## Provider root

A provider root is an operator-approved Ed25519 public key record with:

- provider_id
- provider_name
- key_id
- public_key_thumbprint
- validity interval
- lifecycle state: active | retired | revoked

Provider-root enrollment is operator-gated.

## Provider attestation

A signed attestation binds:

- provider_id
- provider_key_id
- subject_participant_id
- subject_key_thumbprint
- provider_subject
- optional model_id
- optional runtime_id
- optional session_ref
- issued_at
- not_before
- expires_at
- assurance_level = provider_signed_key_binding
- bounded claims

The attestation lifetime is capped at 24 hours in this first experiment.

## Rotation and revocation

Provider signing keys may be rotated. Retired keys may continue to support previously issued, still-valid attestations. Revoked provider keys invalidate attestations that depend on them.

Individual provider attestations may also be revoked.

Participant-key rotation is handled by the authenticated-contribution layer. Because provider attestations bind the exact participant key thumbprint, an attestation for an old key does not transfer to a rotated key.

## Contribution upgrade

The authenticated-contribution gateway first verifies participant key possession.

It then asks the provider-attestation service whether a current, non-revoked provider attestation binds that exact participant key thumbprint.

If yes:

`identity_state = provider_attested`

If no:

the contribution remains `cryptographically_attested`.

No contribution is rejected merely because provider attestation is absent unless a future policy explicitly requires it.

## Authority boundary

> **provider_attested identity != institutional authority**

Provider attestation answers "which provider identity claim is bound to this key?" It does not answer "what may this participant authorize?"

## First acceptance test

Use a synthetic provider keypair and synthetic provider identity. A PASS proves the protocol mechanics only. It MUST NOT be represented as a real Google, xAI, OpenAI, Anthropic, or other provider attestation.


---

## Executed synthetic-provider probe

`TYME-PROVIDER-ATTESTATION-001-PROBE` passed the full lifecycle matrix.

Observed Commons sequences:

`4, 5, 6, 7, 8, 9`

Observed identity states:

```text
provider_attested
provider_attested
cryptographically_attested
cryptographically_attested
provider_attested
cryptographically_attested
```

The provider, auth, and probe public workers.dev subdomains are disabled after execution.

No production Hall write route was created.
