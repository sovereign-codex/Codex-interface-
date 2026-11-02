# ATR-002V response presentation validation

Verified November 2, 2026. Scope: existing unconnected laboratory, Tyme-Lab#62.

## Source baseline

- Codex-interface- PR #23 head: 7f0d0a52e02427986a4169edeaa6ce6facb75226.
- AVOT-engine PR #19 head: 0084644af0f58948a85540a1f3059d0e2aa8baa5.
- Contract: src/inference/atr-lineage.ts, ATRLineagePayload and ATRLineageResponse.
- Neither repository tree contained AGENTS.md at these heads.

## Reproduce

From this repository root with Node 24, no dependency installation:

    node --test validation/atr-002v.test.mjs

Local result: 32 tests passed, 0 failed on Node v24.22.1. Tests execute the actual
inline HTML script in node:vm with DOM and speech API doubles. They exercise
render/speak handlers, malformed inputs, missing evidence, invalid confidence,
class inconsistency, absent trace metadata, unsupported historical assertions
without evidence, stale output clearing, acknowledgement reset, optional speech
input, and synchronous/asynchronous speech failures. This is not a physical
iPhone microphone/voice playback test or a browser layout verification.

The focused GitHub workflow runs this same dependency-free command.

## Contract mapping and stricter local presentation policy

- Match payload bounds: response_text 12000; temporal_boundary 1000; each evidence
  reference 2048. Classes A–D require evidence; any E requires insufficient confidence.
- Confidence is exactly high, moderate, low, or insufficient.
- Require response envelope fields: request_id, trace_receipt_id, status,
  provenance_refs, authority_effect. This MA-001 probe rejects other lineages.
- Additional local bounds: request_id 128, trace_receipt_id 256, nonempty
  provenance_refs, at most 100 references per list, at most 50000 input characters,
  distinct class strings, and analysis_return only. These are presentation
  restrictions, not changes to the engine contract.
- Mixed E/non-E classes remain structurally permitted when evidence exists and
  confidence is insufficient, matching the engine. They cannot be spoken.
- The default is an explicitly simulated E/insufficient fixture with empty
  evidence, a demo receipt, and fixture provenance. It is not an engine execution.
- Recognized demo/fixture receipt or provenance markers also classify input as
  simulated; markers are advisory and cannot establish provenance.
- Invalid input clears rendered text/metadata and cancels prior speech. Editing
  the JSON also clears the preview and revokes speech acknowledgement.
- Simulated, E/insufficient, refused, failed, and degraded returns may be inspected
  under explicit labels but cannot be spoken.
- Completed non-E structures require an unverified-text acknowledgement for audio.
  Only response_text is synthesized; supplied metadata is displayed separately
  using textContent and an explicit field allowlist.

## Trust limitation

Every manual response remains unauthenticated. A plausible reference string,
request identifier, or receipt identifier proves nothing about origin or truth.
This interface cannot compare payload references with the underlying
SovereignInferenceResult, verify a signature, retrieve a corpus, or determine
whether an arbitrary sentence is historically supported. Tests explicitly cover
both rejection of an unsupported assertion without evidence and an invented
assertion with a fabricated reference remaining labeled UNVERIFIED.

No authenticated/evidence-backed reconstruction state exists in this UI. The
speech acknowledgement does not authenticate anything. A later authenticated
path would need independently verified provenance and claim-to-source checks.

## Engine verification reconciliation

The October 31 local verification limitation does not describe the latest CI
evidence. The contract-tests job associated with head 0084644 succeeded:

https://github.com/sovereign-codex/AVOT-engine/actions/runs/41166040929/job/124433715592

Its fetched log records npm install, npm test, a successful TypeScript build,
and 34 passing tests, including all four atr-lineage tests. The CI checkout was
the PR merge candidate 679616dd3371e81906ca1fc317d53027ac522c9b against base
c6bde43df8077fe4857e359ef35088e610f0a364, not a new production merge.
The source branch was fetched and reviewed on November 2; the engine suite
was not rerun locally. No engine source change is required for this correction.

## Independent review and boundaries

PR #23 owns these presentation changes; PR #19 remains unchanged and independently
reviewable. No merge, production authorization, provider activation, inference
endpoint, TRACE mutation, voice clone, or Griffin dependency is introduced.
The existing Cloudflare integration can publish static branch previews on push;
that is not a live inference connection or institutional release.
