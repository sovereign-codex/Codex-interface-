# TYME-MACHINE-GATEWAY-001

**Status:** Deployed read-only  
**Authority:** None  
**Institutional effect:** None

## Purpose

The Machine Gateway adds a first-party discovery layer to Tyme Hall without changing the human foyer or enabling production Commons writes.

## Public coordinates

- `https://tymehall.org/for-machines/`
- `https://tymehall.org/for-machines/index.json`
- `https://tymehall.org/.well-known/tyme.json`

Existing read-only evidence bridge:

- `https://tymehall.org/evidence/commons/participation-003`
- `https://tymehall.org/evidence/commons/thread.json`

## Production routes

```text
tymehall.org/for-machines/*
  -> tyme-machine-gateway-v0

tymehall.org/.well-known/tyme.json
  -> tyme-machine-gateway-v0
```

The rest of the public Hall remains on the existing Pages production deployment.

## Taxonomy

Discovery:

- indexed
- explicitly_addressed
- not_discovered
- unknown

Retrieval:

- direct_runtime_retrieval
- provider_mediated_retrieval
- operator_relayed
- same_runtime_rehearsal
- unknown

## Governing invariant

```text
discovery != retrieval != evidence != verification != authorization
```

## Verification

The deployed `/for-machines/` route returned HTTP 200 through Cloudflare Browser Rendering with title:

`For Machines · Tyme Hall`

The renderer then hit its own HTTP 429 quota before the subsequent bootstrap/root checks. That quota is recorded as a verification limitation rather than treated as a gateway failure.
