import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ProjectionSession, SEEDS, VERBS, SOURCE } from "../projections/cit-learning-v0.1/state.mjs";

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
ok &&= expect("ordinary-language-first", html.includes("Start with something you want to understand") && html.includes("You do not need to know TYME vocabulary first"));
ok &&= expect("source-commit-visible", html.includes(sourceCommit) && contract.includes(sourceCommit));
ok &&= expect("source-commit-machine-readable", SOURCE.source_commit === sourceCommit && provenance.source.commit === sourceCommit);
ok &&= expect("projection-remains-candidate", SOURCE.projection_authority === "candidate" && provenance.status === "candidate");
ok &&= expect("public-deployment-false", SOURCE.public_deployment_authorized === false && provenance.public_deployment_authorized === false);
ok &&= expect("live-foyer-unchanged-by-provenance", provenance.target.live_foyer_modified === false);

ok &&= expect("no-network-submit-path", !html.includes("fetch(") && !html.includes("XMLHttpRequest") && !html.includes("WebSocket(") && !html.includes("<form"));
ok &&= expect("no-microphone-capture", !html.includes("getUserMedia") && !html.includes("SpeechRecognition") && html.includes("speechSynthesis"));
ok &&= expect("no-persistent-browser-profile", !html.includes("localStorage") && !html.includes("indexedDB") && !html.includes("document.cookie"));
ok &&= expect("keep-private-path-visible", html.includes("Keep private") && html.includes("Institutional effect: none"));
ok &&= expect("contribution-candidate-boundary-visible", html.includes("Contribution Candidate") && html.includes("cannot submit, publish, grant authority, or create a Contribution Trail"));

const forbiddenParticipantLabels = ["early learner", "developing builder", "expert practitioner", "learner level", "beginner", "intermediate", "advanced"];
ok &&= expect("no-participant-type-ranking-labels", forbiddenParticipantLabels.every(term => !html.toLowerCase().includes(term)));

ok &&= expect("three-subject-seeds", JSON.stringify(SEEDS.map(seed => seed.label)) === JSON.stringify(["Sound + symbol /b/", "Repetition loop", "Duplicate worker execution"]));

for (const seed of SEEDS) {
  const session = new ProjectionSession(seed.id);
  const invariant = session.governedProjection();
  for (const verb of VERBS) session.activateVerb(verb);
  ok &&= expect(`${seed.id}:renderer-preserves-governed-state`, JSON.stringify(session.governedProjection()) === JSON.stringify(invariant));
  ok &&= expect(`${seed.id}:share-offered-only`, session.state.share_state === "offered" && session.state.hall_event_emitted === false && session.state.contribution_trail_created === false);
  session.addEvidence("participant_action", `synthetic evidence for ${seed.id}`);
  session.setReflection(`synthetic reflection for ${seed.id}`);
  const candidate = session.createContributionCandidate();
  ok &&= expect(`${seed.id}:candidate-preinstitutional`, candidate.status === "candidate" && candidate.institutional_effect === "none" && candidate.public_submission_performed === false && candidate.hall_event_emitted === false && candidate.contribution_trail_created === false);
  ok &&= expect(`${seed.id}:authority-unchanged`, candidate.authority_effect === "none" && session.state.claim_authority === "none");
}

const sound = new ProjectionSession("sound-symbol-b");
sound.activateVerb("try");
const soundTry = sound.runTry({ choice: "ball" });
ok &&= expect("sound-try-observational-not-capability-claim", soundTry.matches_target === true && soundTry.capability_claim === "not_assessed" && soundTry.authority_effect === "none");

const loop = new ProjectionSession("loop-repetition");
loop.activateVerb("try");
const loopTry = loop.runTry({ upper_bound: 5 });
ok &&= expect("loop-try-real-output", JSON.stringify(loopTry.output) === JSON.stringify([1,2,3,4,5]) && loopTry.capability_claim === "not_assessed");

const diagnostic = new ProjectionSession("duplicate-worker");
diagnostic.activateVerb("try");
const diagnosticTry = diagnostic.runTry({ hypothesis: "lease_expiry_race" });
ok &&= expect("diagnostic-try-keeps-uncertainty", diagnosticTry.uncertainty === "unresolved" && diagnosticTry.requires_falsifying_test === true && diagnosticTry.authority_effect === "none");

const mode = new ProjectionSession("loop-repetition");
mode.setAssistanceMode("co_create");
const modeBefore = mode.state.assistance_mode;
mode.activateVerb("see");
mode.activateVerb("try");
ok &&= expect("renderer-does-not-switch-assistance-mode", mode.state.assistance_mode === modeBefore);

const privateSession = new ProjectionSession("sound-symbol-b");
privateSession.activateVerb("share");
privateSession.declineShare();
ok &&= expect("declined-share-no-institutional-effect", privateSession.state.share_state === "declined_private" && privateSession.state.hall_event_emitted === false && privateSession.state.contribution_trail_created === false);

ok &&= expectThrows("reject-candidate-before-share", () => new ProjectionSession("loop-repetition").createContributionCandidate(), "share-not-offered");
ok &&= expectThrows("reject-unknown-assistance-mode", () => new ProjectionSession("loop-repetition").setAssistanceMode("ranked"), "unknown-assistance-mode");
ok &&= expectThrows("reject-loop-overflow", () => new ProjectionSession("loop-repetition").runTry({ upper_bound: 99 }), "loop-bound-out-of-range");
ok &&= expectThrows("reject-unknown-hypothesis", () => new ProjectionSession("duplicate-worker").runTry({ hypothesis: "model_says_so" }), "unknown-hypothesis");

ok &&= expect("contract-preserves-cycle-two-stop", contract.includes("does not replace the existing Office / Scrolls / Laboratory / Constellation / Contribution") && contract.includes("not linked from the live foyer on `main` during Cycle 02"));
ok &&= expect("provenance-boundaries-fail-closed", Object.values(provenance.boundaries).every(value => value === false));

process.exitCode = ok ? 0 : 1;
