import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

const foyer = fs.readFileSync(path.join(root, "index.html"), "utf8");
const routeDir = path.join(root, "route-candidates", "cit-learning-live-route-v0.1");
const contract = fs.readFileSync(path.join(routeDir, "ROUTE_CONTRACT.md"), "utf8");
const provenance = JSON.parse(fs.readFileSync(path.join(routeDir, "provenance.json"), "utf8"));
const projectionDir = path.join(root, "projections", "cit-learning-v0.1");
const projectionHtml = fs.readFileSync(path.join(projectionDir, "index.html"), "utf8");
const projectionContract = fs.readFileSync(path.join(projectionDir, "PROJECTION_CONTRACT.md"), "utf8");
const projectionProvenance = JSON.parse(fs.readFileSync(path.join(projectionDir, "provenance.json"), "utf8"));

function expect(name, condition, detail = "") {
  const ok = Boolean(condition);
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` (${detail})` : ""}`);
  return ok;
}

let ok = true;

const firstGridStart = foyer.indexOf('<section class="grid">');
const firstGridEnd = firstGridStart >= 0 ? foyer.indexOf("</section>", firstGridStart) : -1;
const participationStart = foyer.indexOf('data-route-role="bounded-participation"');
const participationEnd = participationStart >= 0 ? foyer.indexOf("</section>", participationStart) : -1;
const orientationStart = foyer.indexOf("<h2>Orientation and deeper inspection</h2>");
const institutionalGrid = firstGridStart >= 0 && firstGridEnd > firstGridStart
  ? foyer.slice(firstGridStart, firstGridEnd)
  : "";
const participationPanel = participationStart >= 0 && participationEnd > participationStart
  ? foyer.slice(participationStart, participationEnd)
  : "";

const institutionalEntries = [
  ['href="office/"', "<h3>Office</h3>"],
  ['href="scrolls/"', "<h3>Scrolls</h3>"],
  ['href="laboratory/"', "<h3>Laboratory</h3>"],
  ['href="constellation/"', "<h3>Constellation</h3>"],
  ['href="contribute/"', "<h3>Contribution</h3>"]
];

ok &&= expect("mobile-viewport", foyer.includes('name="viewport"'));
ok &&= expect("institutional-five-preserved", institutionalEntries.every(([href, title]) => institutionalGrid.includes(href) && institutionalGrid.includes(title)));
ok &&= expect("institutional-first-grid-has-five-cards", (institutionalGrid.match(/class="card-link"/g) || []).length === 5);
ok &&= expect("learning-route-not-sixth-card", participationPanel.length > 0 && !participationPanel.includes('class="card-link"'));
ok &&= expect("learning-route-after-institutional-grid", firstGridEnd >= 0 && participationStart > firstGridEnd);
ok &&= expect("learning-route-before-deeper-orientation", participationStart >= 0 && orientationStart > participationStart);
ok &&= expect("inspection-versus-participation-distinction-visible",
  participationPanel.includes("The five entrances above help you inspect the institution") &&
  participationPanel.includes("This separate path lets you work with one temporary sample question")
);
ok &&= expect("five-learning-verbs-visible-at-seam",
  ["Talk", "See", "Try", "Make", "Share"].every(word => participationPanel.includes(word))
);
ok &&= expect("learning-route-points-to-reviewed-source",
  participationPanel.includes('href="projections/cit-learning-v0.1/"') &&
  participationPanel.includes('data-learning-route="true"')
);
ok &&= expect("foyer-entry-boundary-visible",
  participationPanel.includes("creates no account or learner rank") &&
  participationPanel.includes("carries nothing into institutional memory")
);

ok &&= expect("no-automatic-redirect", !/http-equiv\s*=\s*["']refresh["']/i.test(foyer) && !foyer.includes("location.href") && !foyer.includes("location.replace"));
ok &&= expect("route-adds-no-form-or-script", !participationPanel.includes("<form") && !participationPanel.includes("<script"));
ok &&= expect("projection-return-to-foyer-visible", projectionHtml.includes('href="../../index.html"') && projectionHtml.includes("Tyme Hall foyer"));
ok &&= expect("source-projection-still-candidate", projectionContract.includes("Status: public-facing source candidate") && projectionProvenance.status === "candidate");
ok &&= expect("source-projection-still-non-authorizing", projectionContract.includes("Authority: non-authorizing"));
ok &&= expect("source-production-route-still-false", projectionProvenance.production_route_authorized === false && projectionProvenance.public_deployment_authorized === false);

ok &&= expect("route-status-candidate", provenance.status === "candidate");
ok &&= expect("route-source-merge-exact", provenance.source_projection.merged_commit === "ec55fb7106bcc110c21ea0ca3a0a46647fa3c73e");
ok &&= expect("route-href-machine-readable", provenance.target.route_href === "projections/cit-learning-v0.1/");
ok &&= expect("route-production-authorization-false", provenance.authorization.production_route_authorized === false);
ok &&= expect("all-route-authorizations-fail-closed", Object.values(provenance.authorization).every(value => value === false));
ok &&= expect("integration-invariants-affirmed", Object.entries(provenance.integration_invariants).every(([key, value]) => key === "source_projection_rewrite_authorized" ? value === false : value === true));

ok &&= expect("contract-rejects-sixth-category", contract.includes("not become a sixth institutional category"));
ok &&= expect("contract-preserves-five-entrance-order", contract.includes("1. Office") && contract.includes("2. Scrolls") && contract.includes("3. Laboratory") && contract.includes("4. Constellation") && contract.includes("5. Contribution"));
ok &&= expect("contract-makes-merge-production-gate-explicit", contract.includes("merge is itself a production-exposure gate"));
ok &&= expect("contract-stop-before-merge", contract.includes("Stop before merge"));

process.exitCode = ok ? 0 : 1;
