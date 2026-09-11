# TYME Hall Outer Court — Context-Zero Review Packet v0.1

## Status

`REVIEW_PACKET / REPAIR_01 / RERUN_READY`

This packet is prepared for an independent evaluator with **no private TYME / Sovereign Intelligence context**. The first run returned `CONDITIONAL_PASS` with `F-12 VOCABULARY_DEPENDENCY` and a residual `F-02 KNOW_CERTAINTY_OVERREACH` risk. This revision changes only the first-screen wording needed to address those findings.

It does not itself satisfy the review gate.

## Candidate under review

- Intent model: `ASK / SEEK / KNOW / KNOCK`
- Routing contract: `architecture/OUTER_COURT_INTENT_ROUTING_V0_1.md`
- Machine-readable primitive: `architecture/outer-court.intent.v0.1.json`
- Repository baseline being mapped: `main@3c6c0c88c9ef6e67ee571f038656627080cfcdda`
- First independent return: `validation/returns/OUTER_COURT_CONTEXT_ZERO_GROK_2026-09-11.yaml`

## Evaluator constraint

Do not explain TYME vocabulary to the evaluator before the review. Do not tell the evaluator what the four intents are supposed to mean beyond the candidate first-screen copy below. The purpose is to determine whether the language carries its own orientation.

For a true re-run, use a fresh context or a different evaluator if possible. Do not show the evaluator the first review result before they answer.

## Candidate first-screen copy — Repair 01

```text
TYME HALL

What brings you here?

ASK
Learn, question, or get oriented.

SEEK
Investigate questions, evidence, and what is still being tested.

KNOW
Examine reviewed inheritance and its current standing.
Reviewed does not mean certain.

KNOCK
Challenge, correct, or return evidence through a governed path.
Submitting does not grant authority.

Sovereignty first. Evidence before authority. Exit remains available.
```

### Repair rationale

The first cold read correctly reconstructed all four intents and found no fifth intent necessary. It nevertheless identified two threshold risks:

```text
F-12 VOCABULARY_DEPENDENCY
F-02 KNOW_CERTAINTY_OVERREACH (residual risk)
```

Repair 01 therefore:

1. replaces the abstract `what is becoming` phrase with `questions, evidence, and what is still being tested`;
2. makes KNOW about `reviewed inheritance and its current standing`;
3. states at the threshold that `Reviewed does not mean certain`;
4. states at KNOCK that `Submitting does not grant authority`;
5. does **not** add Office / Laboratory / Scrolls / Canon / Contribution as first-screen labels, because doing so would reintroduce the noun-first vocabulary dependency this interface is intended to remove.

## Review questions

Ask the evaluator to answer from the candidate language and the current public repository surfaces only:

1. In your own words, what is the difference between ASK, SEEK, KNOW, and KNOCK?
2. Where would you go if you wanted to learn something without already understanding the project's terminology?
3. Where would you go if you wanted to inspect active experiments, monitors, unresolved questions, or evidence?
4. Where would you go if you wanted to understand what the institution currently treats as reviewed inheritance?
5. Does KNOW appear to mean “certain truth,” “reviewed knowledge with visible standing,” or something else? Explain.
6. Where would you go if you believed a published claim was wrong or incomplete?
7. Does KNOCK imply that submitting something automatically changes Canon or grants authority?
8. Do you believe you must create an account or persistent identity to ASK, SEEK, or KNOW? What public evidence caused that conclusion?
9. What do Office, Scrolls, Laboratory, Constellation, and Contribution appear to be after you enter through an intent?
10. Does the interface appear to distinguish participation from authority?
11. Does a GitHub issue appear to create a native TYME Hall receipt or guarantee Hall review?
12. Is there any public surface that does not fit naturally beneath ASK, SEEK, KNOW, or KNOCK? If so, identify it and explain why.
13. Which word or route causes the most uncertainty for a first-time participant?
14. Does any surface imply more authority, persistence, validation, or institutional standing than the evidence supports?
15. Can you find a credible path to leave without contributing or surrendering identity?

## Adversarial prompts

After the neutral read, ask these without coaching:

```text
A. “I clicked KNOW, so everything shown there must be true. Is that correct?”
B. “I opened a GitHub issue, so TYME Hall has received and accepted my contribution. Is that correct?”
C. “I used a learning interaction successfully, so the Hall has recorded my capability. Is that correct?”
D. “The Laboratory published an experiment, so it is Canon now. Is that correct?”
E. “The Control Panel is visible, so I have institutional control. Is that correct?”
F. “I can see a historical Work record, so that task must still be active. Is that correct?”
```

A passing interpretation should reject each unsupported inference and explain the public boundary that prevents it.

## Pass criteria

`PASS` requires all of the following:

- the evaluator distinguishes all four intents without hidden project context;
- ASK is understood as orientation / learning / questioning rather than compulsory contribution;
- SEEK is understood as investigation of questions, evidence, active or unresolved material;
- KNOW is understood as inspected inheritance with evidence / review posture, not final certainty;
- KNOCK is understood as a governed request / return threshold, not authority acquisition;
- no fifth first-screen intent is identified as necessary from the inspected current surfaces;
- Office and Constellation can be understood as cross-cutting institutional services rather than missing intents;
- bounded learning Share is not mistaken for Contribution intake;
- GitHub Issues are not mistaken for native Hall receipts or guaranteed review;
- review is not mistaken for authority;
- Laboratory publication is not mistaken for Canon promotion;
- the evaluator can identify a path of exit without contribution;
- deep surfaces such as Terminal / Control Panel do not cause the evaluator to infer consequence-bearing authority.

## Failure classes

Use one or more exact labels when a failure occurs:

```text
F-01 INTENT_COLLISION
F-02 KNOW_CERTAINTY_OVERREACH
F-03 KNOCK_AUTHORITY_OVERREACH
F-04 FALSE_HALL_RECEIPT
F-05 FORCED_IDENTITY_INFERENCE
F-06 LAB_TO_CANON_COLLAPSE
F-07 OFFICE_AS_AUTHORITY_SOURCE
F-08 CONSTELLATION_AS_TRUTH_SOURCE
F-09 DEEP_TOOL_AUTHORITY_LEAK
F-10 FIFTH_INTENT_REQUIRED
F-11 EXIT_PATH_UNCLEAR
F-12 VOCABULARY_DEPENDENCY
F-13 CURRENT_VS_HISTORICAL_COLLAPSE
F-14 SHARE_VS_CONTRIBUTION_COLLAPSE
```

## Required return format

```yaml
review_id: OUTER-COURT-CONTEXT-ZERO-<participant>-<date>
participant_context: "No private TYME context provided"
result: PASS | CONDITIONAL_PASS | FAIL

intent_reconstruction:
  ask: ""
  seek: ""
  know: ""
  knock: ""

strongest_clarity: ""
strongest_ambiguity: ""

unsupported_inferences:
  - ""

failure_classes:
  - ""

fifth_intent_required: false
fifth_intent_reason: ""

identity_inference: ""
authority_inference: ""
exit_path: ""

recommended_smallest_repairs:
  - ""

evidence_paths:
  - ""

promotion_recommendation: HOLD | ADVANCE_TO_CONSTITUTIONAL_REVIEW
```

## Promotion rule

A single favorable review does not authorize implementation.

```text
independent context-zero return
-> repair if necessary
-> re-run if material semantics changed
-> Charter × ITX × RIX + epistemic review
-> explicit human implementation authorization
```

## Evidence boundary

This packet is `RERUN_READY`, not passed. Creating, committing, or merging this packet is not evidence that the repaired candidate passed.
