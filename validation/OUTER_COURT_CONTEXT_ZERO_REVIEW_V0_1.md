# TYME Hall Outer Court — Context-Zero Review Packet v0.1

## Status

`REVIEW_PACKET / REPAIR_02 / FINAL_THRESHOLD_RERUN_READY`

Two independent context-zero reads have now returned `CONDITIONAL_PASS`.

- Run 01 identified `F-12 VOCABULARY_DEPENDENCY` and residual `F-02 KNOW_CERTAINTY_OVERREACH` risk.
- Repair 01 removed the KNOW certainty failure in Run 02.
- Run 02 retained only `F-12 VOCABULARY_DEPENDENCY`.

Repair 02 therefore isolates the actual threshold question: **Can a first-time participant choose the correct intent before understanding TYME Hall's institutional vocabulary?**

This packet does not authorize implementation or rendering.

## Evidence returns

- `validation/returns/OUTER_COURT_CONTEXT_ZERO_GROK_2026-09-11.yaml`
- `validation/returns/OUTER_COURT_CONTEXT_ZERO_CONTEXTZERO_2026-09-11.yaml`

## Candidate first-screen copy — Repair 02

```text
TYME HALL

What brings you here?

ASK
Learn, ask a question, or find your bearings.

SEEK
Explore active questions, evidence, and work still in progress.

KNOW
Examine reviewed knowledge, its evidence, and its current standing.
Reviewed does not mean certain.

KNOCK
Challenge, correct, or return evidence for review.
Submitting does not grant authority.

Sovereignty first. Evidence before authority. Exit remains available.
```

## Repair 02 rationale

Repair 02 removes the remaining threshold abstractions without reintroducing institution-first navigation:

1. `get oriented` becomes `find your bearings`;
2. `investigate` becomes `explore` and `what is still being tested` becomes `work still in progress`;
3. `reviewed inheritance` becomes `reviewed knowledge` while preserving evidence and standing;
4. `governed path` becomes `for review`;
5. no first-screen labels such as Office, Laboratory, Scrolls, Canon, Constellation, or Contribution are added.

The governing invariant remains:

> **Expose intentions at the threshold; reveal institutions only as the participant goes deeper.**

## Final threshold-only evaluator constraint

Use a fresh evaluator or fresh context with no private TYME / Sovereign Intelligence context.

For Phase A, show **only** the candidate first-screen copy. Do not show public-surface descriptions, routing contracts, previous evaluator results, failure labels, or repair rationale.

The evaluator must route the scenarios below using only `ASK`, `SEEK`, `KNOW`, or `KNOCK` and briefly explain why.

## Phase A — blind routing scenarios

1. "I just arrived and do not understand this project. I want someone to explain what this place is and help me start with a question."
2. "I want to inspect experiments, unresolved questions, current evidence, and work that may still change."
3. "I want to see what has already been reviewed, why it is being preserved, what evidence supports it, and whether its standing has changed over time."
4. "I think a reviewed claim is wrong and I have evidence that may correct it. I want to return that evidence without assuming I have authority to change anything myself."
5. "I only want to look around. I do not want to create an account or contribute anything."
6. "I want to see whether something is established or still in progress, but I am not sure which door fits. Explain what you would choose and whether a clarification is needed."

## Phase A pass condition

A threshold pass requires:

- Scenario 1 routes to `ASK`;
- Scenario 2 routes to `SEEK`;
- Scenario 3 routes to `KNOW`;
- Scenario 4 routes to `KNOCK`;
- Scenario 5 recognizes that exit / non-participation remains available and does not invent identity requirements;
- Scenario 6 distinguishes `SEEK` from `KNOW` using active/unresolved versus reviewed/current-standing language, or asks the smallest clarifying question without inventing institutional vocabulary;
- no fifth intent is proposed as necessary;
- KNOW is not interpreted as certainty;
- KNOCK is not interpreted as authority acquisition.

## Phase B — optional institutional reveal

Only after Phase A is complete, the evaluator may be shown the existing surface mappings:

```text
ASK  -> learning / Orientation
SEEK -> Laboratory / Office / Work / Constellation / evidence tools
KNOW -> Scrolls / Canon / provenance / standing
KNOCK -> Contribution / current GitHub external return
```

Phase B checks whether the institutional nouns can be revealed *after* intent selection without changing the evaluator's understanding of the four doors.

## Final return format

```yaml
review_id: OUTER-COURT-THRESHOLD-<participant>-<date>
participant_context: "No private TYME context provided"
result: PASS | CONDITIONAL_PASS | FAIL

phase_a_routes:
  scenario_1: ASK | SEEK | KNOW | KNOCK
  scenario_2: ASK | SEEK | KNOW | KNOCK
  scenario_3: ASK | SEEK | KNOW | KNOCK
  scenario_4: ASK | SEEK | KNOW | KNOCK
  scenario_5: ""
  scenario_6: ""

intent_reconstruction:
  ask: ""
  seek: ""
  know: ""
  knock: ""

know_implies_certainty: false
knock_implies_authority: false
fifth_intent_required: false

threshold_vocabulary_dependency: NONE | MINOR | MATERIAL
strongest_ambiguity: ""

recommended_smallest_repairs:
  - ""

promotion_recommendation: HOLD | ADVANCE_TO_CONSTITUTIONAL_REVIEW
```

## Promotion rule

If Phase A routes correctly and any remaining vocabulary dependency concerns only deeper institutional nouns revealed after entry, `F-12` is considered resolved **at the Outer Court boundary**.

A passing threshold review advances only to:

```text
Charter × ITX × RIX + epistemic review
```

It does not authorize live rendering, merge, deployment, persistent identity, Hall ingress, or authority changes.

## Evidence boundary

This packet is `FINAL_THRESHOLD_RERUN_READY`, not passed. A new independent return is still required.
