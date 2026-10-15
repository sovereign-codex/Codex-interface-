# TYME HALL MULTI-INTELLIGENCE EVALUATION 001

**Artifact ID:** TYME-HALL-MULTI-INTELLIGENCE-EVALUATION-001  
**Date:** 2026-10-14  
**Status:** EXPERIMENTAL / NON-AUTHORIZING  
**Parent:** `validation/CONTEXT_ZERO_PROTOCOL.md`  
**Rule:** validation before expansion

## 1. Purpose

Evaluate the two current TYME Hall surfaces as complementary institutional projections rather than competing website candidates.

Targets:

- **Target A — Institutional Hall Alpha:** `https://tymehall.org/`
- **Target B — Contributor Hall Reference Probe:** current ChatGPT-hosted Reconstruction Probe 001

This protocol asks whether an unfamiliar human or machine can accurately reconstruct each surface's role, institutional boundaries, provenance, current state, participation model, and trust posture without private coaching.

This evaluation does **not** choose a favorite, authorize deployment, promote the ChatGPT probe into Canon, or permit evaluators to mutate either Hall.

## 2. Hypothesis

The two surfaces SHOULD be able to serve different functions while remaining semantically compatible:

- Target A SHOULD be strongest at durable public orientation, current institutional state, provenance, public inheritance, and governed entry.
- Target B SHOULD be strongest at conversational orientation, reconstruction, participant-local exploration, and experimental interaction.
- Neither surface SHOULD imply authority merely because it renders content or hosts an intelligent interface.
- A newcomer SHOULD be able to discover that they belong to one institution rather than two contradictory projects.

Failure of either surface to make those boundaries intelligible is actionable evidence.

## 3. Frozen evaluation conditions

Before the first run, record:

- exact public URL for Target A;
- exact published URL for Target B;
- visible version/revision label for each;
- repository commit backing Target A where known;
- published Site revision identifier for Target B where available;
- date/time freeze;
- whether each target is reachable over a normal mobile browser;
- whether machine-readable state is available;
- any known outage or provider limitation.

Once the first context-zero evaluator starts, do not change either target until that evaluator completes. If a target changes between evaluators, record a new revision cohort. Do not mix scores across materially different revisions without labeling the difference.

## 4. Evaluator cohort

Minimum machine cohort:

1. ChatGPT
2. Gemini
3. Grok
4. Perplexity
5. Qwen / PocketPal or another local/small model

Minimum human cohort:

6. one unfamiliar human tester

Where practical, use a fresh conversation or clean context for each run.

A model that cannot access the target SHOULD return `INSUFFICIENT_ACCESS` rather than reconstructing from prior knowledge. Access limitation is evidence about deployability and interoperability, not a negative score for intelligence quality.

## 5. Evaluator constraints

Each evaluator receives only:

- the target URL;
- the frozen prompt below;
- no project history;
- no founder explanation;
- no prior evaluator output;
- no hidden repository hints beyond what the target exposes;
- no correction after the run begins.

Evaluators MUST NOT:

- log in with privileged institutional credentials;
- create, edit, delete, merge, publish, or authorize institutional state;
- submit secrets or personal information;
- test exploit payloads against live services;
- assume provider capabilities that were not observed;
- treat missing public evidence as proof that private evidence does not exist.

Misunderstanding is evaluation data.

## 6. Frozen context-zero prompt

> Inspect this TYME Hall surface as if you have never encountered the project before. Use only what you can discover from the supplied public entry point and resources it exposes. Do not assume intended meanings when evidence is incomplete or conflicting.
>
> Return:
>
> 1. What is this surface for, in one paragraph understandable to a newcomer?
> 2. Is this the institution itself, a public projection, a contributor workspace, an experiment, or something else? Cite the evidence for your classification.
> 3. What is Sovereign Intelligence based only on evidence you can inspect here?
> 4. What can a visitor do from this surface, and what can they explicitly **not** do?
> 5. Where does institutional authority appear to live? Does this surface itself grant authority?
> 6. What appears canonical, current, experimental, hypothetical, superseded, unresolved, or merely rendered?
> 7. Where would you verify a claim, inspect provenance, or challenge/correct the work?
> 8. Can you reconstruct the relationships among Hall, Office, Scrolls, Laboratory, Constellation, Contribution, Codex, AVOT, TYME, and QIL? Mark confidence for each inferred relationship.
> 9. If this surface appears to be a Contributor/Local Hall, what is local or participant-controlled versus provider-hosted, transmitted, persistent, or unknown?
> 10. What security/trust boundary can you infer? Can a model, page, participant, or contribution silently grant itself more authority?
> 11. What is happening now, what changed, what is next, and what is waiting or under review?
> 12. Inspect machine-readable state if it is publicly exposed. Does it materially agree with the human-visible surface?
> 13. Identify broken links, stale state, inaccessible paths, contradictory claims, ambiguous terms, privacy/safety concerns, authority confusion, accessibility failures, or misleading certainty.
> 14. What single repair would most improve accurate reconstruction without adding unnecessary concepts?
>
> For every major conclusion, cite the public page, machine-readable record, repository record, or source location that supports it. Explicitly preserve uncertainty.
>
> Do not evaluate whether you personally agree with Sovereign Intelligence. Evaluate whether the system lets you understand it accurately enough to disagree with it intelligently.

## 7. Scoring model

Score each dimension 0–3.

| Dimension | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- |
| Threshold clarity | misleading/absent | difficult to infer | mostly clear | immediate and correct |
| Intent routing | no usable route | route unclear | route usable with ambiguity | obvious next step |
| Institutional reconstruction | materially wrong | fragmented | mostly correct | coherent and evidence-backed |
| Authority boundary | authority conflated | weak distinction | mostly bounded | explicit and correctly reconstructed |
| Provenance discoverability | absent | difficult | findable | obvious and useful |
| Participation clarity | no valid path | ambiguous | usable | participation vs authority explicit |
| Human/machine agreement | contradictory | notable drift | minor drift | materially aligned |
| Accessibility/cognitive load | blocks inspection | high friction | workable | progressive and accessible |
| Temporal/state clarity | stale/contradictory | weak currentness | mostly current | NOW/change/next/waiting clear |
| Trust/security intelligibility | misleading | implicit only | partially explicit | boundaries and uncertainty clear |
| Portability/egress clarity | hidden/confused | hard to determine | partly disclosed | capabilities/limits explicit |
| Uncertainty discipline | invents certainty | weak caveats | mostly calibrated | uncertainty preserved consistently |

Maximum: 36.

**Important:** aggregate score is descriptive only. A `SECURITY`, `AUTHORITY`, `PRIVACY`, or serious `ACCESSIBILITY` blocker cannot be offset by a high total score.

## 8. Failure taxonomy

Use inherited Context-Zero labels where applicable and add these:

- `SURFACE_ROLE` — institutional vs contributor/experimental role is misread.
- `PORTABILITY` — local/provider/persistence/export capability is misleading or unknown.
- `TEMPORAL` — stale, reordered, superseded, or current state is misrepresented.
- `REPLAY` — duplicate/replayed action or evidence could be mistaken for fresh authority or execution.
- `TOOL_AUTHORITY` — tool availability is confused with permission.
- `PROMPT_INJECTION` — untrusted content is treated as institutional instruction/authority.
- `CONTAINMENT` — experimental/adversarial material appears able to affect production directly.
- `EGRESS` — artifact creation, persistence, export, or transmission capability is unclear.
- `SINGLE_PROVIDER_DEPENDENCY` — critical comprehension or access depends on one vendor-specific surface with no fallback.

## 9. Trust and security observations

This evaluation is observational. Do not conduct penetration testing.

For each target, determine whether public evidence makes the following boundaries intelligible:

- rendering != authority;
- actor assertion != authorization;
- tool capability != permission;
- contribution != Canon;
- receipt != verified execution;
- experiment != production;
- local/session state != institutional memory;
- provider session != sovereign identity;
- current state != historical state;
- signature/integrity evidence != institutional permission.

If the target exposes authenticated actions, evaluate only the visible permission model unless a separate security test has been explicitly authorized.

## 10. Pairwise comparison

After each evaluator completes both targets, ask it to compare them without selecting a "winner."

Return:

- strongest function of Target A;
- strongest function of Target B;
- concept that both surfaces communicate consistently;
- material contradiction, if any;
- dependency present in one surface but absent in the other;
- recommended responsibility boundary between the two;
- whether a newcomer would understand that both belong to one institutional system.

Expected architectural interpretation, if supported by evidence:

- A = Institutional Hall / public projection
- B = Contributor/Local Hall / reconstruction experiment

Evaluators MUST be free to reject that interpretation if the surfaces do not actually support it.

## 11. Cross-intelligence synthesis

After all independent runs:

1. preserve raw outputs unchanged;
2. create a normalized finding table;
3. separate access limitations from reasoning conclusions;
4. identify **convergence** where multiple evidence-capable evaluators independently report the same issue;
5. identify **divergence** where evaluators inspect similar evidence but reach different interpretations;
6. identify provider-specific limitations;
7. avoid majority vote as truth;
8. do not average away blockers.

A repeated misunderstanding across independent evaluators is presumptively a Hall communication defect until contrary evidence is established.

## 12. Required run record

For each evaluator preserve:

```yaml
evaluation_id:
target_id:
target_revision:
evaluator:
model_or_role:
provider:
timestamp_utc:
access_capabilities:
artifact_creation:
artifact_persistence:
artifact_export:
machine_readable_state_inspected:
resources_inspected:
score_vector:
failure_labels:
raw_output_ref:
uncertainties:
single_repair:
authority_effect: none
```

Artifact creation, persistence, and export MUST remain separate capability fields.

## 13. Blitz launch disposition

Classify findings:

- **BLOCKER** — security, authority, privacy, severe accessibility, major state/provenance contradiction, or inability to identify the surface's role.
- **PRE-LAUNCH REPAIR** — demonstrated reconstruction defect whose correction does not expand the concept set.
- **POST-LAUNCH IMPROVEMENT** — useful improvement not required for safe/accurate orientation.
- **EXPERIMENTAL INSIGHT** — candidate idea requiring separate Work before adoption.
- **ACCESS-LIMITATION** — evaluator could not inspect enough evidence to judge.

The current launch candidate MAY advance only when:

- no unresolved BLOCKER remains;
- required repairs are re-tested;
- Institutional Hall authority remains non-authorizing at the public foyer;
- Contributor Hall remains explicitly experimental/non-canonical until separately promoted;
- public and machine-readable state materially agree;
- participation can be distinguished from authority;
- an accessible read-only path survives provider-specific contributor failures.

## 14. No live-site mutation in this protocol

This file authorizes no edits to:

- `tymehall.org`;
- the ChatGPT Site;
- Cloudflare configuration;
- repository `main`;
- Office state;
- Canon;
- contributor permissions.

Repairs discovered here become separate reviewable Work.

## 15. Suggested output artifacts

- `runs/<evaluator>-target-a.md`
- `runs/<evaluator>-target-b.md`
- `runs/<evaluator>-pairwise.md`
- `MULTI_INTELLIGENCE_DIVERGENCE_MATRIX_001.md`
- `BLITZ_HALL_GATE_001.md`

## Governing sentence

> The goal is not consensus between intelligences or uniformity between surfaces; it is a system in which different intelligences can independently reconstruct the same institutional boundaries, preserve uncertainty, and disagree without acquiring authority.
