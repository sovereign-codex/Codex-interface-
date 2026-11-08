# TYME-MACHINE-DISCOVERY-001

**Status:** Candidate protocol, production read-only gateway deployed  
**Authority:** None  
**Institutional effect:** None

## Purpose

TYME-MACHINE-DISCOVERY-001 separates how an external intelligence **discovers** Tyme Hall from how evidence is later **retrieved**.

A Public Intelligence Terminal must not collapse search indexing, provider-mediated grounding, direct HTTP retrieval, operator relay, and same-runtime context into one generic concept of "web access."

## Discovery states

- `indexed`
- `explicitly_addressed`
- `not_discovered`
- `unknown`

## Retrieval states

- `direct_runtime_retrieval`
- `provider_mediated_retrieval`
- `operator_relayed`
- `same_runtime_rehearsal`
- `unknown`

## Primary invariant

```text
discovery != retrieval != evidence != verification != authorization
```

## Machine Gateway

Canonical human-readable entrance:

`https://tymehall.org/for-machines/`

Canonical machine index:

`https://tymehall.org/for-machines/index.json`

Bootstrap:

`https://tymehall.org/.well-known/tyme.json`

The gateway is read-only and creates no authority.
