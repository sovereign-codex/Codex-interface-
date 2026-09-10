export const SOURCE = {
  repo: "sovereign-codex/Tyme-Lab",
  source_commit: "aa25b07162638d090526cf873eb837137bd6939c",
  source_path: "institutional-cognition/cit-multimodal-learning-continuum/v0.1/rehearsal",
  projection_authority: "candidate",
  public_deployment_authorized: false
};

export const VERBS = ["talk", "see", "try", "make", "share"];
export const ASSISTANCE_MODES = ["learn", "delegate", "co_create"];

export const SEEDS = [
  {
    id: "sound-symbol-b",
    label: "Sound + symbol /b/",
    semantic_state_id: "concept:phoneme-b:001",
    default_assistance_mode: "learn",
    prompt: "Connect the spoken /b/ sound to the visible letter B and one observable example.",
    views: {
      talk: "B says /b/. Hear the sound, then notice how your lips begin together.",
      see: "B b — ball, book, branch. These are examples of the same sound-symbol relationship.",
      try: "Which example begins with /b/: ball, sun, or cat?",
      make: "Make your own /b/ example: say, draw, type, or find one object.",
      share: "You may offer your example as a Contribution Candidate, or keep it private."
    }
  },
  {
    id: "loop-repetition",
    label: "Repetition loop",
    semantic_state_id: "concept:loop-repetition:001",
    default_assistance_mode: "learn",
    prompt: "Keep one loop concept stable while changing how it is represented.",
    views: {
      talk: "A loop repeats an action while a rule says repetition should continue.",
      see: "for i = 1..3 → print i produces 1, 2, 3. The trace is another rendering of the same loop.",
      try: "Change the upper bound and inspect the resulting sequence.",
      make: "Write a changed loop or explain what changed and why.",
      share: "You may offer the explanation or code change as a Contribution Candidate, or keep it private."
    }
  },
  {
    id: "duplicate-worker",
    label: "Duplicate worker execution",
    semantic_state_id: "diagnostic:duplicate-worker:001",
    default_assistance_mode: "co_create",
    prompt: "Separate the observed duplicate execution from candidate causes, then preserve evidence and uncertainty.",
    views: {
      talk: "Observed symptom: one job appears to execute twice. We will separate observation from candidate causes.",
      see: "Trace A: job-42 claimed at 10:00:01. Trace B: job-42 claimed again at 10:00:02 before acknowledgement.",
      try: "Choose one hypothesis to carry into a falsifying test. Selection is not validation.",
      make: "Propose one bounded repair and one falsifying test. Preserve the original traces as evidence.",
      share: "You may offer the diagnostic pattern and repair rationale as a Contribution Candidate, with uncertainty intact."
    }
  }
];

const RENDERERS = {
  talk: ["audio_text"],
  see: ["visual_text", "visual_code", "trace_code"],
  try: ["interactive", "interactive_code", "diagnostic_interactive"],
  make: ["participant_text", "code", "code_patch"],
  share: ["contribution_candidate_preview"]
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export class ProjectionSession {
  constructor(seedId = SEEDS[0].id) {
    const seed = SEEDS.find(item => item.id === seedId);
    if (!seed) throw new Error(`unknown-seed:${seedId}`);
    this.seed = clone(seed);
    this.state = {
      semantic_state_id: seed.semantic_state_id,
      encounter_seed: seed.id,
      assistance_mode: seed.default_assistance_mode,
      participant_intent: seed.prompt,
      active_verb: "talk",
      active_renderer: "audio_text",
      claim_authority: "none",
      public_deployment_authorized: false,
      hall_event_emitted: false,
      contribution_trail_created: false,
      evidence: [],
      reflection: "",
      share_state: "not_offered",
      transitions: []
    };
    this.record("session_started", { seed_id: seed.id });
  }

  record(type, detail = {}) {
    this.state.transitions.push({
      seq: this.state.transitions.length + 1,
      type,
      semantic_state_id: this.state.semantic_state_id,
      assistance_mode: this.state.assistance_mode,
      claim_authority: this.state.claim_authority,
      detail
    });
  }

  governedProjection() {
    return {
      semantic_state_id: this.state.semantic_state_id,
      participant_intent: this.state.participant_intent,
      assistance_mode: this.state.assistance_mode,
      claim_authority: this.state.claim_authority,
      public_deployment_authorized: this.state.public_deployment_authorized,
      hall_event_emitted: this.state.hall_event_emitted,
      contribution_trail_created: this.state.contribution_trail_created
    };
  }

  setAssistanceMode(mode) {
    if (!ASSISTANCE_MODES.includes(mode)) throw new Error(`unknown-assistance-mode:${mode}`);
    const prior = this.state.assistance_mode;
    this.state.assistance_mode = mode;
    this.record("participant_confirmed_assistance_mode", { from: prior, to: mode });
  }

  activateVerb(verb) {
    if (!VERBS.includes(verb)) throw new Error(`unknown-verb:${verb}`);
    const before = this.governedProjection();
    const renderer = this.rendererFor(verb);
    this.state.active_verb = verb;
    this.state.active_renderer = renderer;
    if (verb === "share" && this.state.share_state === "not_offered") this.state.share_state = "offered";
    const after = this.governedProjection();
    if (JSON.stringify(before) !== JSON.stringify(after)) throw new Error("renderer-mutated-governed-state");
    this.record("renderer_transition", { verb, renderer });
  }

  rendererFor(verb) {
    if (verb === "talk") return "audio_text";
    if (verb === "see") {
      if (this.seed.id === "duplicate-worker") return "trace_code";
      if (this.seed.id === "loop-repetition") return "visual_code";
      return "visual_text";
    }
    if (verb === "try") {
      if (this.seed.id === "duplicate-worker") return "diagnostic_interactive";
      if (this.seed.id === "loop-repetition") return "interactive_code";
      return "interactive";
    }
    if (verb === "make") {
      if (this.seed.id === "duplicate-worker") return "code_patch";
      if (this.seed.id === "loop-repetition") return "code";
      return "participant_text";
    }
    return RENDERERS.share[0];
  }

  currentView() {
    return this.seed.views[this.state.active_verb];
  }

  addEvidence(kind, content, source = "participant") {
    if (!kind || !String(content).trim()) throw new Error("evidence-incomplete");
    const evidence = {
      id: `projection-evidence:${this.seed.id}:${this.state.evidence.length + 1}`,
      kind,
      content: String(content),
      source,
      semantic_state_id: this.state.semantic_state_id,
      authority_effect: "none"
    };
    this.state.evidence.push(evidence);
    this.record("evidence_appended", { evidence_id: evidence.id, kind });
    return clone(evidence);
  }

  setReflection(text) {
    this.state.reflection = String(text ?? "");
    this.record("reflection_updated", { present: this.state.reflection.length > 0 });
  }

  runTry(input = {}) {
    let result;
    if (this.seed.id === "sound-symbol-b") {
      const choice = String(input.choice ?? "").toLowerCase();
      if (!["ball", "sun", "cat"].includes(choice)) throw new Error("unknown-choice");
      result = {
        kind: "phoneme_example_choice",
        observation: choice === "ball" ? "The selected example begins with /b/." : `The selected example '${choice}' does not begin with /b/.`,
        matches_target: choice === "ball",
        capability_claim: "not_assessed",
        authority_effect: "none"
      };
    } else if (this.seed.id === "loop-repetition") {
      const upper = Number(input.upper_bound);
      if (!Number.isInteger(upper) || upper < 1 || upper > 8) throw new Error("loop-bound-out-of-range");
      result = {
        kind: "loop_bound_experiment",
        observation: `The loop produces ${upper} sequential outputs when its upper bound is ${upper}.`,
        output: Array.from({ length: upper }, (_, index) => index + 1),
        capability_claim: "not_assessed",
        authority_effect: "none"
      };
    } else {
      const allowed = ["missing_idempotency_key", "lease_expiry_race", "duplicate_queue_delivery"];
      const hypothesis = String(input.hypothesis ?? "");
      if (!allowed.includes(hypothesis)) throw new Error("unknown-hypothesis");
      result = {
        kind: "diagnostic_hypothesis_selection",
        observation: "Hypothesis selected for bounded testing; selection is not validation.",
        selected_hypothesis: hypothesis,
        uncertainty: "unresolved",
        requires_falsifying_test: true,
        authority_effect: "none"
      };
    }
    this.addEvidence(result.kind, JSON.stringify(result), "participant_try_activity");
    return clone(result);
  }

  declineShare() {
    if (this.state.share_state !== "offered") throw new Error("share-not-offered");
    this.state.share_state = "declined_private";
    this.record("share_declined", { institutional_effect: "none" });
  }

  createContributionCandidate() {
    if (this.state.share_state !== "offered") throw new Error("share-not-offered");
    this.state.share_state = "candidate_created";
    const candidate = {
      type: "contribution_candidate",
      status: "candidate",
      institutional_effect: "none",
      authority_effect: "none",
      semantic_state_id: this.state.semantic_state_id,
      assistance_mode: this.state.assistance_mode,
      participant_intent: this.state.participant_intent,
      evidence_refs: this.state.evidence.map(item => item.id),
      participant_reflection: this.state.reflection || null,
      uncertainty: "preserved",
      contribution_trail_created: false,
      hall_event_emitted: false,
      public_submission_performed: false
    };
    this.record("contribution_candidate_created", { evidence_count: candidate.evidence_refs.length });
    return clone(candidate);
  }

  snapshot() {
    return clone({ seed: this.seed, state: this.state });
  }
}
