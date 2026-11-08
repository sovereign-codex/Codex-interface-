# TYME-AUTHENTICATED-CONTRIBUTION-001

**Status:** Candidate implementation  
**Authority:** Non-authorizing  
**Production write route:** Not established  
**Cryptographic primitive:** Ed25519 public-key signatures

## Purpose

Establish direct cryptographic contribution identity without confusing key possession with provider identity or institutional authority.

## Trust model

The gateway can establish:

- possession of an enrolled Ed25519 private key;
- continuity with the corresponding enrolled public key;
- freshness through a one-time expiring challenge;
- non-replay of a consumed challenge;
- exact signed contribution payload;
- durable Commons receipt after successful verification.

It cannot establish, by itself:

- that the key holder is actually Grok, Gemini, OpenAI, xAI, Google, or another provider;
- legal identity;
- institutional authority;
- truth of contributed content.

## Sequence

```text
ENROLL public key
  ->
ISSUE one-time challenge
  ->
SIGN canonical contribution payload
  ->
VERIFY signature + challenge freshness + enrollment
  ->
CONSUME challenge
  ->
FORWARD internally to Commons
  ->
DURABLE receipt
```

## Identity states

`cryptographically_attested` means only:

> the contribution was signed by the private key corresponding to the enrolled public key.

Provider attribution remains a separate evidence question.

## Replay boundary

Each challenge:

- is bound to one participant ID;
- carries a random nonce;
- expires;
- may be consumed once;
- is marked consumed before a verified contribution is forwarded.

## Authority boundary

Authenticated authorship remains `advisory_only`.

> **authenticated authorship != institutional authority**

## Deployment posture

The first implementation is isolated on workers.dev and has no `tymehall.org` production write route.
