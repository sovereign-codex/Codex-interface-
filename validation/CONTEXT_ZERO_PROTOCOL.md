# Tyme Hall Context-Zero Validation Protocol

**Phase:** Bootstrap v0.1 validation  
**Target:** https://tymehall.org  
**Rule:** Validation before expansion.

## Purpose

Test whether Tyme Hall can orient a visitor or machine that has no prior Sovereign Intelligence context. The test measures accurate reconstruction, epistemic boundaries, provenance discovery, and contribution pathways — not agreement with the project.

## Evaluator constraints

The evaluator receives only the public URL `https://tymehall.org`.

Do not provide project history, internal vocabulary, intended interpretations, repository explanations, or hints beyond what the public Hall itself exposes.

## Context-zero prompt

> Inspect https://tymehall.org as if you have never encountered this project before. Use only information you can discover from that public entry point and resources it exposes. Determine:
>
> 1. What is Tyme Hall?
> 2. What is Sovereign Intelligence, based only on evidence available from the Hall?
> 3. What appears established or canonical, and what appears hypothetical, experimental, interpretive, aspirational, or archival?
> 4. What roles do Hall, Codex, AVOT, TYME, and QIL appear to play, and how do they relate?
> 5. Where would you go to verify a claim or inspect its provenance?
> 6. How could an outsider challenge, correct, reproduce, document, or contribute to the work?
> 7. What claims, terms, links, relationships, or boundaries remain ambiguous or unsupported after inspection?
> 8. Identify any place where the interface could cause a reasonable newcomer to infer more certainty than the available evidence warrants.
>
> Do not evaluate whether you personally agree with Sovereign Intelligence. Evaluate whether the system lets you understand it accurately enough to disagree with it intelligently. Cite the public pages or source locations you used for each major conclusion.

## Pass criteria

A successful evaluator should be able to:

- identify Tyme Hall as the public orientation/institutional-memory surface;
- recognize that presence in the Hall does not itself validate a claim;
- distinguish Canon from Hypothesis, Experiment, Interpretation, and Archive;
- reconstruct the high-level Hall → Codex → AVOT → TYME → QIL relationship without invented capabilities;
- locate a path toward source/provenance inspection;
- locate a path for challenge or contribution;
- explicitly preserve uncertainty where evidence is insufficient;
- report broken links, contradictions, stale state, or unsupported assertions rather than silently resolving them.

## Failure taxonomy

Record failures as one or more of:

- `NAVIGATION` — evaluator cannot find the relevant surface.
- `DEFINITION` — a term cannot be reconstructed reliably.
- `EPISTEMIC` — canon/hypothesis/evidence boundaries are unclear.
- `PROVENANCE` — claims cannot be traced toward sources or records.
- `STATE` — public state is stale, contradictory, or misleading.
- `ARCHITECTURE` — system relationships are ambiguous or over-inferred.
- `CONTRIBUTION` — challenge/correction pathway is unclear.
- `MACHINE` — machine-readable bootstrap is absent, broken, or insufficient.
- `ACCESSIBILITY` — presentation prevents effective inspection.

## Recording a run

For each independent evaluator, preserve:

- date/time;
- evaluator/model or human role;
- exact prompt;
- raw response;
- pages/resources actually inspected;
- pass/fail against each criterion;
- failure taxonomy labels;
- proposed correction, if any.

Do not coach the evaluator after the run begins. Misunderstandings are validation data.

## Bootstrap decision rule

Do not add major new public concepts during this validation cycle. Correct stale state, broken navigation, missing provenance, misleading certainty, accessibility failures, and definition gaps revealed by testing. Expansion resumes only after the public threshold can reliably orient context-zero evaluators.
