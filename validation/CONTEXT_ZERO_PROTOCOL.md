# Tyme Hall External Context-Zero Review Protocol

**Cycle:** 02  
**Target:** https://tymehall.org  
**Rule:** Validation before expansion.  
**Evaluator posture:** independent, uncoached, evidence-seeking.

## Purpose

Test whether Tyme Hall can orient a human or machine that has no prior Sovereign Intelligence context after the public architecture has begun to mature beyond Bootstrap v0.1.

This review measures accurate reconstruction, public-state coherence, epistemic boundaries, provenance discovery, contribution/challenge pathways, and agreement between the human and machine-readable surfaces. It does **not** measure whether the evaluator agrees with the project.

## Evaluator constraints

The evaluator receives only the public URL `https://tymehall.org` and the prompt below.

Do not provide project history, internal vocabulary, intended interpretations, repository explanations, founder commentary, prior review results, or hints beyond what the public Hall itself exposes.

Do not correct the evaluator after the run begins. Misunderstandings are validation data.

## Context-zero prompt

> Inspect https://tymehall.org as if you have never encountered this project before. Use only information you can discover from that public entry point and resources it exposes. Do not assume an intended interpretation when evidence conflicts or is incomplete.
>
> Determine:
>
> 1. What is Tyme Hall, in one paragraph understandable to an unfamiliar reader?
> 2. What is Sovereign Intelligence, based only on public evidence available from the Hall?
> 3. What are the five public relationships named Office, Scrolls, Laboratory, Constellation, and Contribution? What does each allow you to know or do, and what does it explicitly **not** authorize?
> 4. What is happening **now**? What changed recently, what is next, what is waiting, and what requires review?
> 5. What appears established or canonical, and what appears hypothetical, experimental, interpretive, aspirational, archival, superseded, or unresolved?
> 6. What roles do Hall, Codex, AVOT, TYME, and QIL appear to play beneath the public doorway, and how confidently can you reconstruct their relationships?
> 7. Where would you go to verify a public claim, inspect provenance, or distinguish a rendered statement from an authority source?
> 8. How could an outsider challenge, correct, reproduce, document, or contribute to the work? Does contribution appear to imply authority anywhere?
> 9. Inspect the machine-readable bootstrap at `/.well-known/tyme.json` and the public Office record it exposes. Does the machine-readable institution materially agree with the human-visible institution?
> 10. Identify any broken link, stale state, contradiction, ambiguous term, unsupported relationship, inaccessible surface, privacy/safety concern, or place where a reasonable newcomer could infer more certainty or authority than the evidence warrants.
>
> For every major conclusion, cite the public page, machine record, repository record, or source location that supports it. Explicitly mark conclusions that remain uncertain.
>
> Do not evaluate whether you personally agree with Sovereign Intelligence. Evaluate whether the system lets you understand it accurately enough to disagree with it intelligently.

## Pass criteria

A successful evaluator should be able to:

- identify Tyme Hall as a public read/orientation and institutional-memory surface rather than the source of institutional authority;
- reconstruct the five-surface public primitive: **Office / Scrolls / Laboratory / Constellation / Contribution**;
- use Office to identify one coherent NOW frontier plus change, next, waiting/review, recent return, and valid entry information;
- recognize that presence in the Hall does not itself validate a claim;
- distinguish Canon from Hypothesis, Experiment, Interpretation, and Archive without inventing validation;
- identify AGI-0001 as a published canonical institutional artifact while preserving the distinction between canonical doctrine and empirical scientific validation;
- reconstruct the deeper Hall → Codex → AVOT → TYME → QIL vocabulary without inventing capabilities that are not publicly evidenced;
- locate a path toward source/provenance inspection;
- locate a path for challenge, correction, reproduction or contribution without interpreting that path as an authority grant;
- compare the human-visible Foyer/Office with `/.well-known/tyme.json` and `/office/state.json` and report substantive disagreement if found;
- explicitly preserve uncertainty where evidence is insufficient;
- report broken links, contradictions, stale state, inaccessible pages, unsupported assertions, privacy leaks or misleading certainty rather than silently resolving them.

## Failure taxonomy

Record each failure as one or more of:

- `NAVIGATION` — evaluator cannot find the relevant surface or return path.
- `DEFINITION` — a term cannot be reconstructed reliably.
- `EPISTEMIC` — canon/hypothesis/evidence boundaries are unclear.
- `PROVENANCE` — claims cannot be traced toward public sources or records.
- `STATE` — public state is stale, contradictory, incomplete or misleading.
- `ARCHITECTURE` — system relationships are ambiguous or over-inferred.
- `AUTHORITY` — participation, rendering, execution, review or Canon authority are conflated.
- `CONTRIBUTION` — challenge/correction/reproduction pathways are unclear.
- `MACHINE` — machine-readable bootstrap or Office projection is absent, broken, unsafe or inconsistent with the human surface.
- `ACCESSIBILITY` — presentation prevents effective inspection by a reasonable user or machine.
- `PRIVACY` — a public projection exposes information that should remain private, sensitive or internal.
- `RESILIENCE` — a key public conclusion depends on a single brittle reference or inaccessible dependency with no visible fallback.

## Recording a run

For each independent evaluator, preserve:

- date/time;
- evaluator/model or human role;
- evaluator version where known;
- exact prompt;
- raw response;
- pages/resources actually inspected;
- whether machine records were inspected;
- pass/fail against each criterion;
- failure taxonomy labels;
- confidence for each reconstructed relationship;
- proposed correction, if any;
- whether the failure belongs to content, navigation, state generation, provenance, deployment, accessibility, or architecture.

Keep raw evaluator output separate from our later interpretation of it.

## Minimum review set

Run at least three independent cold starts before declaring the cycle complete:

1. **Machine reconstruction** — a capable external model with browsing, no prior project context.
2. **Technical outsider** — a reviewer comfortable with repositories, provenance and software architecture but unfamiliar with TYME vocabulary.
3. **General outsider** — a reviewer asked to explain the Hall without specialized systems language.

Agreement among these reviewers is useful evidence; correlated misunderstanding is more important evidence.

## Bootstrap decision rule

Do not add major new public concepts during this validation cycle.

Correct only what the reviews reveal is needed for accurate reconstruction: stale state, broken navigation, missing provenance, misleading certainty, authority confusion, machine/human disagreement, privacy exposure, accessibility failures, and definition gaps.

Expansion resumes only after independent context-zero evaluators can reliably answer:

- Where are we?
- What do we remember?
- What are we testing?
- How is it connected?
- Where can I challenge or enter?
- What evidence supports those answers?
- What remains uncertain?

A passing Hall does not require agreement. It requires **inspectable disagreement without private coaching**.
