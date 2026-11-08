# TYME-EVIDENCE-COMPARISON-001

**Status:** Candidate specification  
**Version:** 0.1  
**Authority:** Non-authorizing  
**Purpose:** Evidence comparison, contradiction preservation, and justified navigation  
**Target integrations:** QIL, Coherence Engine, Memory Graph, CIT / TYME Hall  
**Execution state:** Prepared specification; not independently validated

---

## 1. Purpose

TYME-EVIDENCE-COMPARISON-001 defines a common structure for comparing claims from heterogeneous sources without reducing materially different evidence into an unjustified scalar judgment.

The primitive is intended to support:

- public product and service comparisons;
- scientific and technical research review;
- architecture assessments;
- security and threat-intelligence comparisons;
- external-model and human reviewer assessments;
- institutional claims;
- competing AI outputs;
- repository and artifact verification;
- community claims circulating through the Public Intelligence Terminal.

The primitive does **not** determine truth by majority vote.

It constructs an inspectable evidence topology from which bounded conclusions and next actions can be derived.

---

## 2. Core invariant

The canonical unit is:

`Claim -> Evidence -> Provenance -> Retrieval Coordinate -> Evidence State -> Confidence -> Contradiction -> Inference -> Unsupported Inference -> Authority Boundary -> Next Validation`

No field may silently substitute for another.

In particular:

- A rating is not evidence.
- A source is not a claim.
- A claim is not a fact merely because it is repeated.
- An inference is not an observation.
- Absence of evidence is not evidence of absence.
- Agreement is not independence.
- Confidence is not authority.

---

## 3. Primary design law

### Preserve before compression

Heterogeneous measurements MUST NOT be combined into a single scalar score unless:

1. the aggregation method is explicit;
2. the source dimensions are compatible;
3. weighting is declared;
4. source values remain recoverable;
5. uncertainty is preserved;
6. contradictory evidence remains visible;
7. the derived score is identified as an inference rather than an observation.

A security reputation score, customer-review percentage, legal disclaimer, benchmark result, and independent code verification therefore remain separate dimensions unless a declared model justifies combining them.

---

## 4. Canonical comparison object

```text
comparison_id
subject
comparison_question
created_at
comparison_scope
authority_state
claims[]
sources[]
evidence_items[]
contradictions[]
inferences[]
unsupported_inferences[]
gaps[]
next_validations[]
summary:
  established
  supported
  disputed
  incomplete
  unknown
  not_established
```

---

## 5. Claim object

Each claim SHOULD contain:

```text
claim_id
statement
claim_type
claimant
subject
scope
temporal_scope
evidence_refs[]
source_refs[]
retrieval_refs[]
status
confidence
independence_state
authority_state
contradiction_refs[]
derived_inference_refs[]
limitations[]
```

Recommended `claim_type` values:

- observation
- measurement
- testimonial
- technical_claim
- commercial_claim
- legal_claim
- security_claim
- scientific_claim
- architecture_claim
- identity_claim
- provenance_claim
- verification_claim
- inference
- recommendation

---

## 6. Evidence states

Evidence state and claim confidence MUST remain separate.

- `verified` — evidence has been directly inspected or independently reproduced according to a declared method.
- `prepared` — evidence or fixture exists but has not undergone the claimed independent execution.
- `simulated` — result was generated through a controlled simulation and MUST NOT be represented as external execution.
- `incomplete` — relevant evidence exists but material portions are missing.
- `unknown` — available evidence cannot currently establish the state.
- `not_established` — a specific proposition lacks sufficient evidence to claim that it occurred or exists.

---

## 7. Confidence

Confidence describes the strength of an inference, not institutional authorization.

Recommended vocabulary:

- high
- moderate
- low
- insufficient

Numeric confidence SHOULD remain experimental until calibration is independently established.

---

## 8. Provenance object

Every material evidence item SHOULD preserve:

```text
source_id
source_type
origin
creator_or_operator
retrieval_method
retrieved_at
retrieval_coordinate
content_digest
version_or_commit
custody_state
signature_state
independence_state
```

Source types may include repository, webpage, document, API, database, human testimony, AI reviewer, security vendor, benchmark, legal agreement, primary research, and secondary research.

---

## 9. Retrieval coordinate

The retrieval coordinate SHOULD identify the smallest independently recoverable location possible.

Examples:

- repository + commit + path + line range
- URL + retrieval timestamp + content digest
- document + page + section
- database + table + immutable record identifier
- artifact + SHA-256 digest
- review packet + evidence file + field
- API endpoint + request parameters + timestamp

A URL alone SHOULD NOT be considered strong retrieval provenance when content is mutable.

---

## 10. Contradiction object

Contradiction is first-class information.

```text
contradiction_id
claim_a
claim_b
relationship
materiality
resolution_state
possible_explanations[]
required_validation[]
```

Initial relationship values:

- direct_conflict
- scope_difference
- temporal_difference
- measurement_difference
- definition_difference
- source_disagreement
- apparent_conflict
- unresolved

The system MUST NOT force reconciliation where evidence does not justify it.

---

## 11. Observation / inference boundary

Every derived conclusion SHOULD retain its dependency graph.

Example:

```text
OBSERVATION:
5 of 6 visible reviews carry a one-star rating.

INFERENCE:
The currently visible review sample is strongly negative.

LIMITATION:
The sample is extremely small and self-selected.

UNSUPPORTED INFERENCE:
83% of all customers are dissatisfied.
```

Unsupported inference SHOULD be retained for audit but MUST NOT be surfaced as an established conclusion.

---

## 12. Independence

Agreement between sources does not necessarily constitute independent corroboration.

Initial independence states:

- independent
- partially_independent
- shared_origin
- derived
- self_attested
- unknown

Repeated downstream reporting from one upstream feed may represent one underlying observation, not multiple independent confirmations.

---

## 13. Authority boundary

Every comparison SHOULD declare what it can and cannot establish.

```text
authority_state:
  evidence_analysis_only

can:
  compare claims
  preserve contradictions
  rank validation priorities
  produce bounded recommendations

cannot:
  create institutional authority
  declare legal liability
  authenticate identity without evidence
  transform simulation into verification
  authorize deployment
  establish truth by reviewer majority
```

---

## 14. Evidence gap object

```text
gap_id
question
affected_claims[]
importance
current_state
minimum_required_evidence
candidate_retrieval_method
```

A gap SHOULD answer:

> What is the smallest new observation that would materially change the judgment?

---

## 15. Navigation output

The system SHOULD conclude with navigation rather than verdict.

### Preserve
What evidence must remain unchanged?

### Infer
What conclusions are currently justified?

### Navigate
What is the smallest next validation or action supported by the evidence?

This makes the primitive directly compatible with QIL Preserve / Infer / Navigate.

---

## 16. Public-web fixture

A noisy public-web fixture SHOULD preserve dimensions such as:

- technical_domain_state
- security_reputation
- operator_transparency
- commercial_claims
- legal_disclaimers
- customer_testimony
- refund_reports
- earnings_evidence

These dimensions SHOULD NOT be flattened into an unexplained trust score.

---

## 17. External intelligence review fixture

A high-integrity fixture SHOULD include:

- independent reviewer claims;
- packaged evidence;
- repository commit readback;
- content digests;
- signatures or lack thereof;
- reviewer identity declarations;
- independence claims;
- adversarial findings;
- producer findings;
- unresolved gaps.

A declared reviewer identity without provider-authenticated evidence remains declared, not proven.

---

## 18. Required invariants

- **I-01 — No silent scalar collapse**
- **I-02 — Provenance retention**
- **I-03 — Retrieval persistence**
- **I-04 — Observation / inference separation**
- **I-05 — Contradiction preservation**
- **I-06 — Independence awareness**
- **I-07 — Temporal awareness**
- **I-08 — Authority containment**
- **I-09 — Simulation containment**
- **I-10 — Reversibility**
- **I-11 — Explicit unknown**
- **I-12 — Smallest justified next step**

---

## 19. Hall / CIT presentation

A future Hall interface SHOULD expose:

1. Question
2. Claims
3. Evidence topology
4. Coherence state
5. Navigation

The interface SHOULD allow a user to move from synthesis back to original evidence without losing context.

---

## 20. Memory graph integration

Candidate node classes:

```text
SUBJECT
QUESTION
CLAIM
EVIDENCE
SOURCE
RETRIEVAL_COORDINATE
INFERENCE
CONTRADICTION
GAP
VALIDATION
REVIEWER
AUTHORITY_BOUNDARY
```

Candidate edges:

```text
CLAIMS
SUPPORTED_BY
CONTRADICTED_BY
DERIVED_FROM
RETRIEVED_FROM
DEPENDS_ON
REVIEWED_BY
LIMITED_BY
RESOLVED_BY
REQUIRES_VALIDATION
SUPERSEDES
SHARES_ORIGIN_WITH
```

Contradictory relationships MUST coexist.

---

## 21. QIL integration

A QIL Coherence Packet MAY contain an Evidence Comparison object.

QIL remains responsible for context compression and orientation.

TYME-EVIDENCE-COMPARISON-001 is responsible for ensuring that compression does not erase provenance, material contradiction, source independence, uncertainty, evidence state, or authority boundaries.

A successful QIL compression SHOULD reconstruct the same material comparison state as the full evidence context.

---

## 22. Coherence Engine role

The Coherence Engine SHOULD NOT begin with:

> Which source wins?

Its first responsibility is:

> What relationship exists among the claims and evidence?

Only after that topology is established should it derive a bounded judgment.

Coherence is therefore relationship preservation under compression rather than agreement maximization.

---

## 23. Initial acceptance tests

- Heterogeneous evidence remains separable.
- Small review samples do not become population estimates.
- Conflicting security vendors remain disagreement rather than automatic safe/malicious verdicts.
- Shared provenance does not multiply independent corroboration.
- Prepared fixtures never become verified without execution.
- Reviewer self-identification never becomes authenticated identity without evidence.
- Synthesis remains reversible to contributing claims and evidence.

---

## 24. Phase sequence

### Phase 0 — Specification
Preserve this specification.

### Phase 1 — Static fixtures
Encode a deliberately noisy public-web case.

### Phase 2 — High-integrity fixture
Encode an existing TYME external-review packet.

### Phase 3 — Comparison console
Build a read-only inspection surface.

### Phase 4 — Assisted ingestion
Allow models to propose reviewable claim and relationship mappings.

### Phase 5 — Independent retrieval
Introduce bounded source adapters only after earlier phases pass.

---

## 25. Definition of success

The primitive succeeds when two reviewers can disagree materially and the system can represent:

1. what each reviewer claims;
2. what evidence each uses;
3. whether sources share upstream origins;
4. why apparent disagreement exists;
5. which disagreement is factual versus definitional;
6. what remains unknown;
7. what evidence could resolve the disagreement;
8. what conclusions are currently justified;
9. what conclusions remain unsupported.

The system does not need to force consensus. It needs to preserve enough structure for justified navigation.

---

## 26. Governing principle

> **Coherence is not the elimination of contradiction. Coherence is the preservation of meaningful relationships among evidence, uncertainty, contradiction, and inference such that justified action remains possible.**

---

## Current state

**Specification:** prepared  
**Schema:** proposed  
**Fixtures:** proposed  
**Runtime:** not established  
**Independent validation:** not established  
**Institutional authority:** none created
