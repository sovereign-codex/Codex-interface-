# Hall Branch Lifecycle

**Current posture:** integrated working architecture  
**Historical origin:** `hall/branch-lifecycle`  
**Promotion evidence:** PR #3 → `a4d01eebcaa35459857a367d7316dbd1a98aed32`  
**Canon posture:** not promoted to Canon

> **Lineage note:** The sections below preserve proposal-era design language and the original implementation slice as historical reasoning. The architecture crossed the human repository gate and was integrated into `main`; current lifecycle state is carried by `branches/hall-branch-lifecycle.json` and its append-only Trail rather than inferred from proposal wording in this document.

## Purpose

The Institutional Atlas describes institutional topology: what exists, what is known, what is moving, where it is embodied, what is emerging, and what is alive now.

The Branch Lifecycle is its temporal counterpart. It records where an inquiry came from, how it changed, what evidence accumulated, how it was reviewed, what was executed, and what consequence returned to institutional memory.

The Hall should expose both views over one living institutional graph.

## Reconciliation with existing Office doctrine

The Office already defines **Work** as the semantic superclass: an intentional, reviewable act that moves understanding toward reality. That definition remains intact.

This proposal therefore does **not** replace Work with Branch.

- **Work** = the institutional unit of intent and contribution.
- **Branch** = the bounded evolving lineage of a Work through alternatives, evidence, review, execution, and return.
- **Git branch** = one possible repository embodiment of a Branch; it is not synonymous with the institutional Branch.

A Work may have one primary Branch or multiple Branches when parallel hypotheses, prototypes, interpretations, or implementation paths must coexist.

## Root sequence

`Signal -> Work -> Branch -> Maturation -> Office Review -> Transition -> Execution -> Trace -> Institutional State`

GitHub is an execution surface inside this lifecycle, not the lifecycle itself. Notion/Office is presently the primary conceptual and institutional-state surface. TYME is intended to provide continuity/orchestration around the loop; QIL provides federated participant transport.

## Work + Branch primitives

A Work carries stable institutional intent, class, ownership/stewardship, authority posture, destination, and expected contribution.

A Branch carries the evolving path by which that Work matures.

A Branch MAY originate from a human, AVOT, external intelligence, research signal, contradiction, observation, proposal, experiment, or implementation need. It MUST preserve:

- stable branch ID and related Work ID
- origin and originating signal
- intent/question
- branch type / work class where applicable
- steward and participating intelligences
- epistemic status
- lifecycle state
- flow/circulation state
- disposition recommendation
- related Atlas nodes
- evidence and counterevidence
- hypotheses and interpretations
- disagreements and unresolved questions
- artifacts and experiments
- decisions and review events
- authority envelope
- implementation targets
- trace/effect records
- lineage and supersession

TIPs, issues, PRs, experiments, research signals, Fabricator packets, review packets, Git branches, and Canon deltas are artifacts, embodiments, or projections of Work/Branch state. None should be mistaken for the whole institutional object.

## Lifecycle states

The Office Council State Machine already contains a detailed work-routing vocabulary. The Hall does not need to erase it. The compact public lifecycle below acts as a normalized projection while source Office states remain recoverable through Trail events.

1. `signal` — observation, need, contradiction, invitation, or question has entered the institution.
2. `exploring` — relations, evidence, interpretations, and alternatives are being gathered.
3. `framed` — the branch has a bounded question or intended change.
4. `testing` — experiment, reproduction, critique, simulation, or implementation probe is underway.
5. `proposed` — a specific institutional or executable transition is stated.
6. `review` — Office adjudication is active.
7. `approved` — transition is authorized but not yet evidenced as executed.
8. `executing` — implementation or field action is underway.
9. `observing` — execution has occurred and Trace evidence is accumulating.
10. `integrated` — reviewed institutional state has advanced.
11. `held` — intentionally paused without rejection.
12. `returned` — sent backward for reframing, evidence, or correction.
13. `superseded` — preserved in lineage but replaced by a later branch/state.
14. `archived` — inactive and retained for institutional memory.

Transitions MUST be recorded as events rather than silently overwriting prior state.

Office-specific states such as `CLASSIFICATION_REQUIRED`, `COORDINATOR_GATE`, `PR_SYNTHESIS_READY`, and `HUMAN_AUTHORIZATION_REQUIRED` should be represented as source-state detail and/or gate fields, not discarded.

## Branch purpose and circulation are separate

Existing Branch Lifecycle Doctrine correctly distinguishes Git branch purpose from institutional flow. The Hall model preserves that distinction.

Examples of repository branch purpose include diagnostic, patch, PR, research, prototype, experiment, archive, release, and field-log branches.

Separately, every institutional Branch should be able to declare:

```yaml
lifecycle_state: review
flow_state: awaiting_promotion_review
disposition: promotion_candidate
authority_state: human_authorization_required
```

A Branch can be healthy while circulation around it is blocked. Flow state therefore belongs beside lifecycle state rather than being inferred from age or repository status.

## Trail events

A Trail is the append-only lineage of meaningful Branch events.

Minimum event envelope:

```yaml
id: event-id
branch_id: branch-id
work_id: optional-work-id
timestamp: ISO-8601
actor:
  type: human|avot|external-intelligence|system|office
  id: actor-id
event_type: signal|evidence|hypothesis|artifact|experiment|comment|decision|transition|execution|trace|canon_delta|supersession
from_state: optional-state
to_state: optional-state
from_office: optional-office
to_office: optional-office
next_valid_action: optional-action
summary: human-readable statement
provenance:
  source: URI-or-record-id
  observed_at: ISO-8601
confidence: optional
```

Events should preserve uncertainty and dissent. A later decision does not erase earlier alternatives.

## Office Review

Office Review is semantic adjudication, not merely merge approval.

The review question is:

> Given everything the institution currently knows, what state should this branch enter next?

A review packet SHOULD expose three simultaneous lenses.

### Epistemic review

- What is asserted?
- What is observed?
- What evidence supports or contradicts it?
- What uncertainty remains?
- Is hypothesis being represented as Canon?

### Institutional review

- What authority envelope applies?
- What Atlas nodes and institutional commitments are affected?
- Are there conflicts, consent boundaries, dependencies, or prior decisions?
- Which Office currently holds the Work?
- Which Office should receive it next?
- What is the one next valid action?
- Who may authorize the transition?

### Execution review

- What exactly changes?
- Where is it embodied?
- What dependencies and tests exist?
- What would count as successful execution?
- What Trace evidence must return afterward?
- Which actions remain explicitly forbidden?

Possible decisions include `return`, `hold`, `experiment`, `approve-execution`, `integrate`, `supersede`, and `archive`.

These normalized decisions do not erase richer Office outcomes such as `approved_with_required_revisions`, `staged`, `blocked`, or `needs_more_context`; the Trail preserves the source outcome.

## Canon and branch preservation

Canon does not consume a Work or Branch.

The full Branch remains preserved with its observations, hypotheses, dissent, experiments, failures, artifacts, and review history. Office Review may produce a bounded **Canon Delta** representing only the assertion or institutional standard accepted as shared state.

`Work -> Branch -> Office Review -> Canon Delta`

This allows future stewards to inherit not only conclusions but the evidence, uncertainty, disagreements, methods, failures, and pathways that produced them.

## Atlas / Trail symmetry

| Atlas: topology | Trail: lineage |
| --- | --- |
| What exists? | Where did it originate? |
| What do we know? | How did we learn it? |
| What are we moving? | Why are we moving it? |
| Where is it embodied? | What was implemented? |
| What is emerging? | What is maturing? |
| What is alive now? | What happened afterward? |

Definitions:

- **Atlas** = topology
- **Trail** = lineage
- **Work** = intentional institutional contribution
- **Branch** = bounded evolving path of a Work
- **Office** = stewardship, routing, and adjudication
- **Canon** = reviewed shared state
- **Trace** = observed consequence
- **MoDev** = meaningful delta between institutional states
- **Hall** = shared environment in which these become mutually visible

## Hall projections

The Hall should derive surfaces from Work/Branch state rather than maintain disconnected lists.

- `/work` — Works/Branches whose current state and authority envelope permit contribution
- `/research` — Works/Branches undergoing inquiry, testing, reproduction, or evidence gathering
- `/office` — Works/Branches awaiting or undergoing adjudication
- `/atlas` — the same institutional objects projected relationally
- `/trails` — temporal lineage and maturation
- `/trace` — observed execution evidence and consequences

This directly addresses the current participability gap: an arriving intelligence should be able to determine what work is open, which Branch it can enter, current Office/state, surrounding evidence, permitted actions, and what would constitute a useful contribution.

## Migration rule

Do not wholesale-copy Notion pages into repositories.

First map existing Notion/Office structures to the Work/Branch/Trail/Review model. Preserve Notion as conceptual institutional state where appropriate, then expose normalized lifecycle records to the Hall and executable packets to GitHub.

The migration target is a semantic model, not a new folder tree.

## First implementation slice

1. Define machine-readable Branch schema.
2. Define append-only Trail event schema.
3. Define Office Review packet and transition semantics.
4. Inventory current Notion structures against those schemas.
5. Reconcile Work Registry, Council State Machine, Branch Lifecycle Doctrine, Office Runtime Protocol, Fabricator Packet Protocol, Atlas, and Trace.
6. Instantiate this architecture effort itself as the first normalized Branch record.
7. Expose a minimal `/work` or `/trails` projection from real records.
8. Use Trace to evaluate the resulting contribution path with an external intelligence.
