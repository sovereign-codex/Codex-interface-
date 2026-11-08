# TYME-PUBLIC-EVIDENCE-BLIND-001 — Google AI result

**Status:** Opaque challenge payload reached Google AI context; direct live retrieval not established  
**Surface:** Google AI Mode in browser  
**Identity:** Declared  
**Signature:** Unsigned  
**Authority:** Advisory only  
**Institutional effect:** None

## Observation

The blind challenge prompt contained only the public URL and instructions. The opaque token itself was not included in the prompt.

Google AI returned the exact token:

```text
TYME-BLIND-7Q4M-X2P9-K8RV
```

At the same time, the runtime stated that it was unable to retrieve either URL through direct external live browsing and that it was using "the content of the file provided in your request."

## Interpretation

This is **not** ordinary operator relay: the operator did not provide the token.

It is also **not** sufficient to claim direct independent retrieval by the model/runtime, because the runtime explicitly denied successful live browsing.

The strongest justified classification is a new intermediate state:

`provider_mediated_retrieval`

Meaning:

> The external provider or its retrieval/grounding layer supplied source content to the model context, while direct model/runtime network retrieval was not established.

Possible mechanisms include URL preprocessing, provider fetch proxy, search grounding, cached document ingestion, or another provider-controlled retrieval path. The exact mechanism remains unknown.

## What passed

- first-party evidence bridge content reached the Google AI context;
- opaque-token challenge prevented simple prompt echo;
- the returned token exactly matched the bridge payload;
- the runtime preserved uncertainty around live-thread access.

## What remains unestablished

- direct live retrieval of `thread.json`;
- current durable thread sequence count;
- independent model-origin HTTP access;
- provider-authenticated identity;
- signed retrieval attestation.

## Retrieval taxonomy implication

The current retrieval-state vocabulary should distinguish:

- `independent_retrieval`
- `provider_mediated_retrieval`
- `operator_relayed`
- `same_runtime_rehearsal`
- `unknown`

This prevents provider-grounded source injection from being flattened into either direct independent retrieval or operator relay.
