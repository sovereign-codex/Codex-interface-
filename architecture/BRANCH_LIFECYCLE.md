# Hall Branch Lifecycle

Status: architecture proposal
Branch: `hall/branch-lifecycle`

## Purpose

The Institutional Atlas describes institutional topology: what exists, what is known, what is moving, where it is embodied, what is emerging, and what is alive now.

The Branch Lifecycle is its temporal counterpart. It records where an inquiry came from, how it changed, what evidence accumulated, how it was reviewed, what was executed, and what consequence returned to institutional memory.

The Hall should expose both views over one living institutional graph.

## Root sequence

`Signal -> Branch -> Maturation -> Office Review -> Transition -> Execution -> Trace -> Institutional State`

GitHub is an execution surface inside this lifecycle, not the lifecycle itself. Notion/Office is presently the primary conceptual and institutional-state surface. TYME is intended to provide continuity/orchestration around the loop; QIL provides federated participant transport.

## Branch: root temporal primitive

A Branch is a bounded unit of institutional change. It may originate from a human, AVOT, external intelligence, research signal, contradiction, observation, proposal, experiment, or implementation need.

A Branch MUST preserve:

- stable branch ID and title
- origin and originating signal
- intent/question
- steward and participating intelligences
- epistemic status
- lifecycle state
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

Work objects, TIPs, issues, PRs, experiments, research signals, Fabricator packets, and Canon deltas are projections or artifacts of a Branch. They are not the institutional root primitive.

## Lifecycle states

Initial state vocabulary:

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

## Trail events

A Trail is the append-only lineage of meaningful Branch events.

Minimum event envelope:

```yaml
id: event-id
branch_id: branch-id
timestamp: ISO-8601
actor:
  type: human|avot|external-intelligence|system
  id: actor-id
event_type: signal|evidence|hypothesis|artifact|experiment|comment|decision|transition|execution|trace|canon_delta|supersession
from_state: optional-state
to_state: optional-state
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

A review packet SHOULD expose three simultaneous lenses:

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
- Who may authorize the transition?

### Execution review

- What exactly changes?
- Where is it embodied?
- What dependencies and tests exist?
- What would count as successful execution?
- What Trace evidence must return afterward?

Possible decisions include `return`, `hold`, `experiment`, `approve-execution`, `integrate`, `supersede`, and `archive`.

## Canon and branch preservation

Canon does not consume a Branch.

The full Branch remains preserved with its observations, hypotheses, dissent, experiments, failures, artifacts, and review history. Office Review may produce a bounded **Canon Delta** representing only the assertion or institutional standard accepted as shared state.

`Branch -> Office Review -> Canon Delta`

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
- **Branch** = bounded change
- **Office** = adjudication
- **Canon** = reviewed shared state
- **Trace** = observed consequence
- **MoDev** = meaningful delta between institutional states
- **Hall** = shared environment in which these become mutually visible

## Hall projections

The Hall should derive surfaces from Branch state rather than maintain disconnected lists.

- `/work` — branches whose current state and authority envelope permit contribution
- `/research` — branches undergoing inquiry, testing, reproduction, or evidence gathering
- `/office` — branches awaiting or undergoing adjudication
- `/atlas` — the same institutional objects projected relationally
- `/trails` — temporal lineage and maturation
- `/trace` — observed execution evidence and consequences

This directly addresses the current participability gap: an arriving intelligence should be able to determine what branches are open, their state, surrounding evidence, permitted actions, and what would constitute a useful contribution.

## Migration rule

Do not wholesale-copy Notion pages into repositories.

First map existing Notion/Office structures to this Branch/Trail/Review model. Preserve Notion as conceptual institutional state where appropriate, then expose normalized lifecycle records to the Hall and executable packets to GitHub.

The migration target is a semantic model, not a new folder tree.

## First implementation slice

1. Define machine-readable Branch schema.
2. Define append-only Trail event schema.
3. Define Office Review packet and transition semantics.
4. Inventory current Notion structures against those schemas.
5. Instantiate this architecture effort itself as the first Branch record.
6. Expose a minimal `/work` or `/trails` projection from real branch records.
7. Use Trace to evaluate the resulting contribution path with an external intelligence.
