# Notion Office -> Hall Lifecycle Mapping

Status: reconciliation inventory

## Finding

The current Office already contains most of the semantic organs needed for the Hall lifecycle. The implementation task is therefore **normalization and projection**, not replacement or wholesale migration.

Most importantly, existing Office doctrine establishes that **Work is the superclass**. Hall Branch is reconciled as the bounded evolving lineage of a Work rather than a replacement for Work.

## Source mapping

| Existing Office structure | Hall lifecycle role | Migration posture |
| --- | --- | --- |
| `WORK_REGISTRY_SPEC` | Work identity, intent, class, participants, artifacts, authority, lineage, blockers, next action | **Direct semantic parent. Preserve.** Branch records reference `work_id`. |
| `COUNCIL_STATE_MACHINE` | Detailed institutional states, Office routing, gates, handoff fields, reflection loop | **Preserve source vocabulary. Normalize for Hall projection.** `source_state`, `current_office`, `next_office`, `next_valid_action` remain visible. |
| `OFFICE_RUNTIME_PROTOCOL` | Supervised transition execution and handoff behavior | **Runtime contract.** Hall surfaces expose state; runtime consumes transitions only within authority. |
| `Branch Lifecycle Doctrine` | Git branch purpose, lifecycle, disposition, retention, circulation/flow state | **Preserve as repository embodiment doctrine.** Do not conflate Git branch type with institutional Branch state. |
| `FABRICATOR_PACKET_PROTOCOL_v1` | Bounded execution authority, targets, constraints, evidence requirements, execution returns | **Execution projection.** Fabricator packets are generated from authorized Work/Branch transitions. |
| `OFFICE_FIELD_BLUEPRINT_v0.1` | Official roles, packet ecology, conduction paths, Office/Hall/Terminal distinction | **Institutional topology and routing context.** Supplies Office relations and return destinations. |
| System / Objective / Knowledge / Emergence / Runtime Atlas surfaces | Topological and epistemic projections | **Atlas projection.** Relate to Branch via `atlas_relations`; do not duplicate branch history into Atlas pages. |
| Trace / Contribution Trail | Provenance, evidence chain, observed consequence | **Trail evidence substrate.** Hall Trail references Trace rather than replacing raw evidence. |
| Canon Steward / promotion records | Canon posture and reviewed institutional inheritance | **Canon Delta / institutional-state transition.** Preserve full Work/Branch lineage. |
| PR Synthesist / Promotion Reviewer | Repository-readiness and promotion assessment | **Review/execution offices.** Their outputs become review/transition events. |

## Object relationships

```plain text
Objective / Signal
      |
      v
     Work  <------------------------------+
      |                                   |
      +--> Branch A --> Trail events      |
      |       |                           |
      |       +--> evidence / hypotheses  |
      |       +--> Office Review          |
      |       +--> Fabricator Packet      |
      |       +--> Git branch / PR        |
      |       +--> Trace return ----------+
      |
      +--> Branch B (alternate path)
      |
      +--> Artifacts

Atlas = relational projection across these objects
Hall  = participable shared projection across topology + lineage + authority
```

## Field-level mapping

### Work Registry -> Branch linkage

Existing Work fields map as follows:

- `work_id` -> `branch.work_id`
- `work_title` -> parent Work title; Branch may have a narrower title
- `work_type` -> `branch.work_class`
- `objective` -> `branch.intent` / related Objective Atlas node
- `source_surface` -> `origin.source`
- `participants` -> `participants`
- `office_owner` -> `current_office`
- `produced_artifacts` -> `artifacts`
- `related_works` -> lineage/relations
- `review_path` -> review events and `next_office`
- `authority_level` -> authority posture / epistemic status where applicable
- `blockers` -> unresolved questions / flow state
- `next_action` -> `next_valid_action`
- `do_not_do` -> `forbidden_actions`

### Council State Machine -> normalized lifecycle

The detailed state machine should not be discarded. A Hall-facing normalized state is derived while preserving the original state.

Suggested initial projection:

| Office source state | Hall state |
| --- | --- |
| `DISCOVERED`, `INTAKE` | `signal` |
| `CLASSIFICATION_REQUIRED`, `CLASSIFIED` | `exploring` / `framed` |
| `REVIEW_REQUIRED`, `UNDER_REVIEW` | `review` |
| `REVIEWED_WITH_OUTCOME` | `proposed` or `returned` depending outcome |
| `REVISION_REQUIRED` | `returned` |
| `COORDINATOR_GATE`, `PROMOTION_REVIEW_REQUIRED`, `PR_SYNTHESIS_READY`, `HUMAN_AUTHORIZATION_REQUIRED` | `review` or `approved`, with gate preserved separately |
| `READY_FOR_STAGING`, `HELD_IN_STAGING` | `proposed` / `held` |
| `IMPLEMENTED` | `observing` |
| `OBSERVED`, `REFLECTED` | `observing` / `integrated` |
| `CLOSED` | `integrated` or `archived` |
| `REOPENED` | prior lineage + new `exploring` transition |

This table is a projection rule, not a rewrite of Office history.

### Branch Lifecycle Doctrine -> repository embodiment

Repository branch fields should remain distinguishable:

```yaml
branch_type: research
repository_embodiments:
  - sovereign-codex/example@research/hypothesis-a
state: testing
flow_state: awaiting_evidence
```

The repository branch may be retained long-term even after a Hall Branch is integrated, if preservation policy requires it.

### Fabricator Packet -> execution projection

When Office Review authorizes an executable transition, the Hall Branch can generate/reference a Fabricator packet carrying:

- exact repository and ref target
- explicit authority envelope
- constraints and forbidden actions
- drift policy
- evidence requirements
- return contract

The Fabricator return becomes one or more Trail events plus Trace references. Execution does not independently decide Canon or future disposition.

## What should remain in Notion

Keep in Notion while it remains the strongest conceptual/institutional surface:

- rich Office doctrine and constitutions
- review narratives and interpretive synthesis
- institutional posture records
- Atlas orientation pages
- official role definitions
- human-readable reconciliation and reflection

## What should become normalized Hall data

Expose machine-readable records for:

- Work identity/reference
- Branch identity and state
- current/next Office
- flow state
- next valid action
- authority envelope
- forbidden actions
- epistemic posture
- evidence/Trace links
- Atlas relations
- artifacts and repository embodiments
- review decisions
- lineage/supersession

## What should remain execution-specific

Keep repository/runtime implementation details in their native surfaces and reference them:

- Git commits, branches, PRs, workflow runs
- Fabricator execution packets/returns
- simulation outputs
- runtime logs
- raw Trace evidence

## Participability contract

A fresh intelligence entering `/work` should be able to answer without reconstructing the Office manually:

1. What Work is this?
2. Which Branch/path is active?
3. Why does it matter?
4. What is known vs hypothesized?
5. Which Office currently holds it?
6. What is the next valid action?
7. What may I contribute?
8. What may I not do?
9. What evidence would advance the Branch?
10. Where will my contribution return?

If those ten answers are visible, the Hall has crossed from orientation-only to participable institutional state.

## Immediate implementation recommendation

Do **not** activate a new Notion database yet.

First use the existing Work/Office records as source material and create a small normalized fixture set in `Codex-interface-`. Then build `/work` or `/trails` against those fixtures. After the projection is tested with an external intelligence, decide whether Notion needs schema changes or whether a bridge can derive the normalized model from existing pages/registries.
