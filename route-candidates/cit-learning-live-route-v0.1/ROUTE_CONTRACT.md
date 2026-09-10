# CIT Learning Live-Route Candidate v0.1

Status: route candidate  
Source projection: `projections/cit-learning-v0.1/`  
Source projection merge: `ec55fb7106bcc110c21ea0ca3a0a46647fa3c73e`  
Production route: not authorized  
Authority: non-authorizing

## Root decision

Tyme Hall's foyer and the learning interaction surface have different jobs.

The foyer is an institutional map. It helps a newcomer inspect present state, inheritance, experimental work, relationships, and governed contribution.

The learning projection is a participant interaction surface. It lets a newcomer meet one bounded question through TALK / SEE / TRY / MAKE / optional SHARE while independently choosing LEARN / DELEGATE / CO-CREATE.

The learning projection must therefore **not become a sixth institutional category** beside Office, Scrolls, Laboratory, Constellation, and Contribution.

The candidate seam is:

```text
FOYER
  -> five institutional entrances remain unchanged
  -> separate participation probe
       -> bounded question
       -> TALK | SEE | TRY | MAKE | optional SHARE
       -> private exit
       -> return to foyer
```

## Foyer integration rule

The existing five-card institutional entry set remains intact, in the same order and with the same destinations:

1. Office
2. Scrolls
3. Laboratory
4. Constellation
5. Contribution

The learning route appears in a separate panel after those institutional entrances and before deeper orientation surfaces.

Public-facing copy must explain the distinction in ordinary language: the five entrances are for inspecting the institution; the learning route is for participating in one bounded question.

## Participation boundary

Entering the learning route must not:

- create an account;
- create or infer a participant rank;
- establish a persistent learner profile;
- create a Contribution Trail;
- emit a Hall Event;
- submit participant content;
- issue a capability or credential claim;
- change institutional authority;
- silently move a participant into Contribution intake.

SHARE inside the projection remains a reversible local preview only.

## Return boundary

The learning surface must preserve a clear route back to the foyer.

Returning to the foyer carries no participant state, no session identity, no rank, and no institutional consequence. A browser refresh or page exit may discard the temporary learning session.

## Source boundary

This route candidate may link only to the already merged and externally reviewed source projection at:

`/projections/cit-learning-v0.1/`

The route candidate must not rewrite the learning projection during this gate. Any semantic or behavioral change to the projection requires a separate review of that changed artifact.

## Deployment boundary

This branch may be publicly reachable through provider-generated preview infrastructure. Preview reachability is review infrastructure, not production authorization.

Merging a root-foyer route change can cause the hosting provider to publish the new root automatically. Therefore **merge is itself a production-exposure gate for this packet** and requires explicit human authorization after route review.

`production_route_authorized` must remain `false` throughout branch review.

## Acceptance criteria

The route candidate clears branch-level review only if:

- all five existing institutional foyer cards remain present and unchanged;
- the learning entry is visually and semantically separate from those five categories;
- the learning entry points only to `/projections/cit-learning-v0.1/`;
- the projection preserves a visible return to the foyer;
- no automatic redirect enters the learning surface;
- no participant data is transmitted or persisted by the route change;
- no contribution intake is created by following the route;
- no authority or deployment flag becomes true;
- a context-zero evaluator can distinguish institutional inspection from bounded participation without private coaching.

## Non-blocking UX backlog inherited from the Grok return

The route review should observe, but does not need to solve inside this seam packet, the already recorded source-candidate backlog: specialist vocabulary in machine-readable/source views, repetitive protective language, Delegate-mode TRY surprise risk, read-aloud versus conversational voice expectations, and browser SpeechSynthesis variability.

If the foyer integration itself amplifies any of those into material misunderstanding, the finding becomes a route-level blocker.

## Stop condition

Stop before merge.

Passing deterministic and context-zero route review authorizes only a human merge decision for this exact branch head. It does not authorize public Contribution intake, persistent participant records, real child participation, credentials, Canon promotion, or autonomous Steward authority.
