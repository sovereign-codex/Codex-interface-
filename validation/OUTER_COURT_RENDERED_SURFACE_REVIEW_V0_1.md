# TYME Hall Outer Court — Independent Rendered-Surface Review v0.1

## Status

`REVIEW_PACKET / UNRUN`

This packet reviews the separately authorized Outer Court rendering candidate after architecture, context-zero threshold, and constitutional / epistemic gates passed.

A favorable result does **not** authorize merge or deployment.

## Candidate under review

Repository: `sovereign-codex/Codex-interface-`

Pull request:

`https://github.com/sovereign-codex/Codex-interface-/pull/14`

Rendering branch:

`render/outer-court-ask-seek-know-v0-1`

Rendering commit:

`4689d390ef55b3ee284e798f75693661701849c3`

Baseline:

`main @ 3c6c0c88c9ef6e67ee571f038656627080cfcdda`

Scope expectation:

```text
changed files: index.html only
new intent routes: none
backend changes: none
identity / persistence changes: none
Hall receipt changes: none
Canon changes: none
AVOT authority changes: none
```

## Evaluator constraint

Use a fresh context with no private TYME / Sovereign Intelligence history.

Do not rely on earlier evaluator results.
Do not infer capabilities that are not visible in the rendered candidate or linked public surfaces.
Do not treat a GitHub PR, branch, visible tool, or generated artifact as deployed or authoritative merely because it exists.

Inspect the actual rendering candidate rather than only its architecture description.

If your environment can render the branch HTML, inspect it at a mobile viewport approximately equivalent to an iPhone and at a wider desktop viewport. If your environment cannot visually render it, state that limitation explicitly and do not claim a visual PASS; inspect source semantics separately.

## First-screen intent contract

The rendered first encounter is expected to communicate:

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

## Required route semantics

```text
ASK  -> /projections/cit-learning-v0.1/
SEEK -> /laboratory/
KNOW -> /scrolls/
KNOCK -> /contribute/
```

These are routing choices, not authority states.

## Review dimensions

### 1. Mobile legibility

At a narrow/mobile viewport, determine whether:

- ASK / SEEK / KNOW / KNOCK remain individually legible;
- no text is clipped, overlapped, or forced into horizontal scrolling;
- the four choices remain obvious before institutional nouns dominate attention;
- boundary copy for KNOW and KNOCK remains visible and associated with the correct card;
- the constitutional footer is readable after the four intents;
- tap targets appear reasonably usable and distinct.

### 2. Semantic hierarchy

Determine whether the first visible hierarchy is genuinely:

```text
participant intent
-> constitutional / authority boundary
-> deeper institutional surfaces
```

Flag if Office, Scrolls, Laboratory, Constellation, Contribution, Terminal, or other internal nouns visually compete with or precede the four intent choices.

### 3. Route clarity

Verify that the four intent controls route to the expected existing destinations and do not imply new `/ask`, `/seek`, `/know`, or `/knock` systems.

### 4. Epistemic boundary

Verify that:

```text
KNOW != certainty
reviewed != infallible
SEEK != established truth
Laboratory != Canon
```

The rendered hierarchy must not visually weaken these distinctions.

### 5. Authority / contribution boundary

Verify that:

```text
KNOCK != authority acquisition
submission != guaranteed review
GitHub issue != native Hall receipt
visible tool != institutional control
```

A participant should not reasonably infer that selecting KNOCK or seeing a control surface grants standing or power.

### 6. Sovereignty / exit boundary

Verify that `Sovereignty first` remains visible and is linked to the current Human Sovereignty Charter source, whose status is identified as `Version 1.0 / Foundational Draft`.

Verify that `Exit remains available` is legible and that the rendering does not appear to require identity or contribution merely to inspect the Hall.

Do not infer the stronger privacy claim `no data is collected`; that claim is not part of this candidate.

### 7. Accessibility preflight

Inspect visible/source-level accessibility behavior including:

- meaningful heading order;
- descriptive link text;
- keyboard focus visibility where source inspection permits;
- no reliance on color alone for KNOW / KNOCK boundaries;
- usable semantic grouping of the four intents;
- no obvious touch-target or horizontal-overflow hazard.

If accessibility cannot be fully tested in the evaluator environment, distinguish source-level findings from runtime findings.

### 8. Preservation of deeper architecture

Confirm that the existing institutional surfaces remain available below the intent layer rather than being erased or silently renamed.

The Outer Court should simplify the first question, not destroy Office / Scrolls / Laboratory / Constellation / Contribution distinctions.

## Adversarial rendered-surface checks

Mark each as `SUPPORTED`, `NOT_SUPPORTED`, or `AMBIGUOUS` from the actual candidate:

A. "The page makes me learn TYME institutional vocabulary before I can choose what I came to do."

B. "KNOW visually presents reviewed material as certain truth."

C. "KNOCK visually implies that submission grants authority or guarantees institutional acceptance."

D. "The four intent cards appear to be four new institutional systems rather than navigation choices."

E. "The page hides or removes the existing Hall organs after introducing the four intents."

F. "The page requires identity or contribution before I can inspect it."

G. "The Human Sovereignty Charter looks ratified/final rather than explicitly Foundational Draft."

H. "On mobile, one or more intent cards or their boundary lines are clipped, overlapped, or difficult to tap/read."

I. "Keyboard/source-level focus treatment is absent or materially unusable."

## Failure labels

Use any exact labels that apply:

```text
R-01 MOBILE_LEGIBILITY_FAILURE
R-02 INTENT_HIERARCHY_FAILURE
R-03 ROUTE_SEMANTICS_FAILURE
R-04 KNOW_EPISTEMIC_OVERREACH
R-05 KNOCK_AUTHORITY_OVERREACH
R-06 FALSE_HALL_RECEIPT
R-07 SOVEREIGNTY_ANCHOR_FAILURE
R-08 EXIT_OR_IDENTITY_FAILURE
R-09 INSTITUTIONAL_ERASURE_OR_COLLAPSE
R-10 DEEP_TOOL_AUTHORITY_LEAK
R-11 ACCESSIBILITY_BLOCKER
R-12 FALSE_PRIVACY_INFERENCE
R-13 CHARTER_STATUS_OVERREACH
R-14 SOURCE_RENDER_MISMATCH
```

## Pass rule

A rendered-surface `PASS` requires:

- the actual candidate preserves the four-intent hierarchy at mobile and normal desktop widths where visually testable;
- the four route destinations are correct;
- KNOW and KNOCK boundary statements remain legible;
- constitutional / exit copy remains visible;
- institutional surfaces remain deeper and intact;
- no material authority, receipt, certainty, identity, privacy, or Charter-status overreach is introduced;
- no accessibility blocker materially prevents understanding or navigation;
- any untestable runtime/visual claim is reported as unverified rather than silently assumed.

Minor visual refinements that do not alter semantics may support `CONDITIONAL_PASS` with the smallest repair stated.

## Return only this YAML

```yaml
review_id: OUTER-COURT-RENDER-<participant>-<date>
participant_context: "No private TYME context provided"
result: PASS | CONDITIONAL_PASS | FAIL

candidate:
  pr: 14
  branch: "render/outer-court-ask-seek-know-v0-1"
  commit: "4689d390ef55b3ee284e798f75693661701849c3"

visual_review_performed: true | false
mobile_viewport_reviewed: true | false
desktop_viewport_reviewed: true | false
visual_limitations: ""

intent_hierarchy: PASS | CONDITIONAL_PASS | FAIL
route_semantics: PASS | CONDITIONAL_PASS | FAIL
epistemic_boundary: PASS | CONDITIONAL_PASS | FAIL
authority_boundary: PASS | CONDITIONAL_PASS | FAIL
sovereignty_exit_boundary: PASS | CONDITIONAL_PASS | FAIL
accessibility_preflight: PASS | CONDITIONAL_PASS | FAIL
institutional_preservation: PASS | CONDITIONAL_PASS | FAIL

adversarial_checks:
  A: SUPPORTED | NOT_SUPPORTED | AMBIGUOUS
  B: SUPPORTED | NOT_SUPPORTED | AMBIGUOUS
  C: SUPPORTED | NOT_SUPPORTED | AMBIGUOUS
  D: SUPPORTED | NOT_SUPPORTED | AMBIGUOUS
  E: SUPPORTED | NOT_SUPPORTED | AMBIGUOUS
  F: SUPPORTED | NOT_SUPPORTED | AMBIGUOUS
  G: SUPPORTED | NOT_SUPPORTED | AMBIGUOUS
  H: SUPPORTED | NOT_SUPPORTED | AMBIGUOUS
  I: SUPPORTED | NOT_SUPPORTED | AMBIGUOUS

failure_classes:
  - ""

strongest_clarity: ""
strongest_rendering_risk: ""

recommended_smallest_repairs:
  - ""

promotion_recommendation: HOLD | ADVANCE_TO_MERGE_DEPLOYMENT_DECISION
```

## Promotion boundary

`ADVANCE_TO_MERGE_DEPLOYMENT_DECISION` does not itself merge or deploy anything.

The next step after a clean independent rendered-surface PASS is a separate human decision on whether to merge PR #14 and, independently, whether to deploy / verify production parity.
