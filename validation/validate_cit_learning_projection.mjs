import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ProjectionSession, SEEDS, VERBS, SOURCE, ASSISTANCE_INFO } from "../projections/cit-learning-v0.1/state.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const projectionDir = path.join(root, "projections", "cit-learning-v0.1");
const html = fs.readFileSync(path.join(projectionDir, "index.html"), "utf8");
const contract = fs.readFileSync(path.join(projectionDir, "PROJECTION_CONTRACT.md"), "utf8");
const provenance = JSON.parse(fs.readFileSync(path.join(projectionDir, "provenance.json"), "utf8"));

function expect(name, condition, detail = "") {
  const ok = Boolean(condition);
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` (${detail})` : ""}`);
  return ok;
}

function expectThrows(name, fn, fragment) {
  try {
    fn();
    console.log(`FAIL ${name} (did-not-throw)`);
    return false;
  } catch (error) {
    const message = String(error?.message ?? error);
    const ok = message.includes(fragment);
    console.log(`${ok ? "PASS" : "FAIL"} ${name} (${message})`);
    return ok;
  }
}

let ok = true;
const sourceCommit = "aa25b07162638d090526cf873eb837137bd6939c";

ok &&= expect("mobile-viewport", html.includes('name="viewport"'));
ok &&= expect("five-visible-verbs", VERBS.every(verb => html.includes(`data-verb="${verb}"`) && html.includes(`>${verb.toUpperCase()}</button>`)));
ok &&= expect("ordinary-language-first", html.includes("Start with something you want to understand") && html.includes("You do not need to know project vocabulary first"));
ok &&= expect("tyme-hall-explained", html.includes("What is Tyme Hall?") && html.includes("developing public environment for inspecting, learning from, testing, and contributing"));
ok &&= expect("examples-rationale-visible", html.includes("deliberately far apart") && html.includes("sound recognition to programming to systems diagnosis"));
ok &&= expect("public-header-avoids-cit-jargon", !html.includes("Candidate CIT learning projection") && html.includes("Tyme Hall learning projection candidate"));
ok &&= expect("public-status-separates-activity-from-saved-notes", html.includes("`activity: ${summary.activity_count}`") && html.includes("`saved notes: ${summary.saved_note_count}`") && !html.includes("`local notes:"));
ok &&= expect("source-commit-visible", html.includes(sourceCommit) && contract.includes(sourceCommit));
ok &&= expect("source-commit-machine-readable", SOURCE.source_commit === sourceCommit && provenance.source.commit === sourceCommit);
ok &&= expect("projection-remains-candidate", SOURCE.projection_authority === "candidate" && provenance.status === "candidate");
ok &&= expect("public-deployment-false", SOURCE.public_deployment_authorized === false && provenance.public_deployment_authorized === false);
ok &&= expect("live-foyer-unchanged-by-provenance", provenance.target.live_foyer_modified === false);

ok &&= expect("no-network-submit-path", !html.includes("fetch(") && !html.includes("XMLHttpRequest") && !html.includes("WebSocket(") && !html.includes("<form"));
ok &&= expect("no-microphone-capture", !html.includes("getUserMedia") && !html.includes("SpeechRecognition") && html.includes("speechSynthesis"));
ok &&= expect("no-persistent-browser-profile", !html.includes("localStorage") && !html.includes("indexedDB") && !html.includes("document.cookie"));
ok &&= expect("keep-private-path-visible", html.includes("Keep private") && html.includes("Nothing was submitted and there is no institutional effect"));
ok &&= expect("contribution-boundary-visible-in-ordinary-language", html.includes("local preview of what you might offer later") && html.includes("cannot submit, publish, grant authority, or create an institutional contribution record"));
ok &&= expect("read-aloud-not-steward-persona", html.includes("Hear this aloud") && html.includes("browser's text-to-speech") && !html.includes("Hear Steward"));
ok &&= expect("result-audio-alternative", html.includes("Hear result aloud"));
ok &&= expect("fresh-session-reset-disclosed", html.includes("Changing the sample starts a fresh temporary session"));
ok &&= expect("local-session-review-and-clear-visible", html.includes("Review local session") && html.includes("Clear local session"));
ok &&= expect("mobile-verb-bar-does-not-overlay", html.includes(".verb-bar{display:grid") && html.includes("position:static"));

const forbiddenParticipantLabels = ["early learner", "developing builder", "expert practitioner", "learner level", "beginner", "intermediate", "advanced"];
ok &&= expect("no-participant-type-ranking-labels", forbiddenParticipantLabels.every(term => !html.toLowerCase().includes(term)));

ok &&= expect("three-subject-seeds", JSON.stringify(SEEDS.map(seed => seed.label)) === JSON.stringify(["Sound + symbol /b/", "Repetition loop", "Duplicate worker execution"]));
ok &&= expect("seed-share-copy-avoids-internal-candidate-jargon", SEEDS.every(seed => !seed.views.share.includes("Contribution Candidate") && !seed.views.share.includes("Contribution Trail")));

ok &&= expect("assistance-definitions-complete",
  ASSISTANCE_INFO.learn.short.includes("build the capability") &&
  ASSISTANCE_INFO.delegate.short.includes("Do this step for me") &&
  ASSISTANCE_INFO.delegate.behavior.includes("not treated as evidence that I learned it") &&
  ASSISTANCE_INFO.co_create.behavior.includes("contribution distinct") &&
  ASSISTANCE_INFO.co_create.behavior.includes("uncertain")
);

for (const seed of SEEDS) {
  const session = new ProjectionSession(seed.id);
  const invariant = session.governedProjection();
  for (const verb of VERBS) session.activateVerb(verb);
  ok &&= expect(`${seed.id}:renderer-preserves-governed-state`, JSON.stringify(session.governedProjection()) === JSON.stringify(invariant));
  ok &&= expect(`${seed.id}:share-offered-only`, session.state.share_state === "offered" && session.state.hall_event_emitted === false && session.state.contribution_trail_created === false);
  session.addEvidence("saved_local_note", `synthetic note for ${seed.id}`, "participant_saved_note");
  session.setReflection(`synthetic reflection for ${seed.id}`);
  const preview1 = session.createContributionCandidate();
  const preview2 = session.createContributionCandidate();
  ok &&= expect(`${seed.id}:preview-repeatable`, preview1.status === "preview_only" && preview2.status === "preview_only" && session.state.share_state === "previewed");
  ok &&= expect(`${seed.id}:preview-preinstitutional`, preview2.institutional_effect === "none" && preview2.public_submission_performed === false && preview2.hall_event_emitted === false && preview2.contribution_trail_created === false);
  session.declineShare();
  ok &&= expect(`${seed.id}:keep-private-after-preview`, session.state.share_state === "declined_private" && session.state.hall_event_emitted === false && session.state.contribution_trail_created === false);
  ok &&= expect(`${seed.id}:authority-unchanged`, preview2.authority_effect === "none" && session.state.claim_authority === "none");
}

const sound = new ProjectionSession("sound-symbol-b");
sound.activateVerb("try");
const soundTry = sound.runTry({ choice: "ball" });
ok &&= expect("sound-try-observational-not-capability-claim", soundTry.matches_target === true && soundTry.capability_claim === "not_assessed" && soundTry.authority_effect === "none");
ok &&= expect("learn-mode-requires-participant-attempt", soundTry.assistance_mode === "learn" && soundTry.mode_effect === "participant_attempt_before_resolution");

const loop = new ProjectionSession("loop-repetition");
loop.activateVerb("try");
const loopTry = loop.runTry({ upper_bound: 5 });
ok &&= expect("loop-try-real-output", JSON.stringify(loopTry.output) === JSON.stringify([1,2,3,4,5]) && loopTry.capability_claim === "not_assessed");

const diagnostic = new ProjectionSession("duplicate-worker");
diagnostic.activateVerb("try");
const diagnosticTry = diagnostic.runTry({ hypothesis: "lease_expiry_race" });
ok &&= expect("co-create-keeps-contributions-distinct", diagnosticTry.assistance_mode === "co_create" && diagnosticTry.participant_contribution === "lease_expiry_race" && diagnosticTry.system_contribution.includes("Page contribution") && diagnosticTry.uncertainty === "unresolved");

const delegated = new ProjectionSession("loop-repetition");
delegated.setAssistanceMode("delegate");
delegated.activateVerb("try");
const delegatedResult = delegated.runDelegatedResult();
ok &&= expect("delegate-completes-without-learning-claim", delegatedResult.task_completed === true && delegatedResult.learning_claim === false && delegatedResult.capability_claim === "not_assessed" && delegatedResult.participant_contribution === null);
ok &&= expectThrows("delegate-rejects-participant-try-path", () => delegated.runTry({ upper_bound: 3 }), "delegate-use-worked-result");
const delegatedDraft = delegated.delegatedDraft();
ok &&= expect("delegate-draft-no-learning-claim", delegatedDraft.task_completed === true && delegatedDraft.learning_claim === false && delegatedDraft.capability_claim === "not_assessed");

const mode = new ProjectionSession("loop-repetition");
mode.setAssistanceMode("co_create");
const modeBefore = mode.state.assistance_mode;
mode.activateVerb("see");
mode.activateVerb("try");
ok &&= expect("renderer-does-not-switch-assistance-mode", mode.state.assistance_mode === modeBefore);

const accounting = new ProjectionSession("sound-symbol-b");
accounting.activateVerb("try");
accounting.runTry({ choice: "ball" });
let summary = accounting.localSessionSummary();
ok &&= expect("try-counts-as-activity-not-saved-note", summary.activity_count === 1 && summary.saved_note_count === 0);
accounting.addEvidence("saved_local_note", "participant note", "participant_saved_note");
accounting.setReflection("participant reflection");
summary = accounting.localSessionSummary();
ok &&= expect("saved-notes-count-explicit-only", summary.activity_count === 1 && summary.saved_note_count === 2);
accounting.clearLocalSession();
summary = accounting.localSessionSummary();
ok &&= expect("clear-local-session-removes-local-data", summary.activity_count === 0 && summary.saved_note_count === 0 && summary.reflection === null && summary.institutional_effect === "none");

ok &&= expectThrows("reject-preview-before-share", () => new ProjectionSession("loop-repetition").createContributionCandidate(), "share-not-offered");
ok &&= expectThrows("reject-unknown-assistance-mode", () => new ProjectionSession("loop-repetition").setAssistanceMode("ranked"), "unknown-assistance-mode");
ok &&= expectThrows("reject-loop-overflow", () => new ProjectionSession("loop-repetition").runTry({ upper_bound: 99 }), "loop-bound-out-of-range");
ok &&= expectThrows("reject-unknown-hypothesis", () => new ProjectionSession("duplicate-worker").runTry({ hypothesis: "model_says_so" }), "unknown-hypothesis");

ok &&= expect("contract-preserves-cycle-two-stop", contract.includes("does not replace the existing Office / Scrolls / Laboratory / Constellation / Contribution") && contract.includes("not linked from the live foyer on `main` during Cycle 02"));
ok &&= expect("provenance-boundaries-fail-closed", Object.values(provenance.boundaries).every(value => value === false));

process.exitCode = ok ? 0 : 1;
