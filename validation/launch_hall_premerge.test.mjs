/**
 * TYME-HALL-LAUNCH-001: stable premerge check for public static Hall invariants.
 *
 * Runs against every proposed PR targeting main, not just changed files.
 * Does not call public URLs, access secrets, approve a merge, or authorize
 * Cloudflare Pages production deployment. That approval is external/human.
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const ROOT = resolve(import.meta.dirname, "..");
const readText = (p) => readFileSync(resolve(ROOT, p), "utf8");
const json = (p) => JSON.parse(readText(p));

const BOOTSTRAP = ".well-known/tyme.json";
const OFFICE = "office/state.json";
const AGI = "scrolls/AGI-0001/publication.json";
const LEARNING = "projections/cit-learning-v0.1/provenance.json";

test("required, public, source-controlled bootstrap and Hall routes exist", () => {
  for (const p of [
    "index.html",
    BOOTSTRAP,
    "office/index.html",
    OFFICE,
    "scrolls/AGI-0001/index.html",
    AGI,
    "laboratory/index.html",
    "constellation/index.html",
    "contribute/index.html",
    "terminal/index.html",
    "projections/cit-learning-v0.1/index.html",
    LEARNING,
  ]) {
    assert.ok(existsSync(resolve(ROOT, p)), "Missing required public surface: " + p);
  }
});

test("bootstrap recognizes the correct public domain and five read surfaces", () => {
  const b = json(BOOTSTRAP);
  assert.equal(b.canonical_domain, "https://tymehall.org");
  assert.ok(b.schema.startsWith("tyme-hall-bootstrap/"));
  for (const k of ["office", "scrolls", "laboratory", "constellation", "contribution"]) {
    assert.equal(typeof b.public_surface_primitive?.[k], "string", "Missing " + k);
  }
  assert.equal(b.entrypoints?.human, "/");
  assert.equal(b.entrypoints?.office, "/office/");
});

test("machine bootstrap points to the checked Office and public scroll", () => {
  const b = json(BOOTSTRAP);
  assert.equal(b.machine_records.public_office_state, "/office/state.json");
  assert.equal(b.machine_records.first_publication, "/scrolls/AGI-0001/publication.json");
  assert.equal(b.publications.first_publication.scroll_id, "AGI-0001");
  assert.equal(b.publications.first_publication.public_posture, "PUBLISHED_CANONICAL");
});

test("Office is non-authorizing, dated, and may not masquerade as live state", () => {
  const office = json(OFFICE);
  assert.equal(office.contract, "public_office_state_v0");
  assert.equal(office.authority_posture, "non_authorizing");
  assert.equal(office.institutional_effect, "none");
  assert.ok(office.generated_at && !Number.isNaN(Date.parse(office.generated_at)));
  const generated = new Date(office.generated_at).valueOf();
  assert.ok(generated <= Date.now() + 86400000, "Public state generated too far in future");
  assert.ok(typeof office.snapshot_id === "string" && office.snapshot_id.length > 5);
});

test("Office renderer discloses stale/unknown state before presenting Now", () => {
  const html = readText("office/index.html");
  assert.match(html, /id="notice"[^>]*aria-live="polite"/);
  assert.match(html, /STALE PUBLIC OFFICE SNAPSHOT/);
  assert.match(html, /SNAPSHOT DATE UNKNOWN/);
  assert.match(html, /SNAPSHOT CLOCK CONFLICT/);
  assert.match(html, /historical snapshot, not verified current institutional state/);
  assert.ok(html.indexOf('id="notice"') < html.indexOf('id="now"'));
  assert.ok(!html.includes("innerHTML"), "Office state must render as text");
});

test("published AGI-0001 never authorizes independent governance or Canon", () => {
  const p = json(AGI);
  assert.equal(p.scroll.scroll_id, "AGI-0001");
  assert.equal(p.scroll.public_posture, "PUBLISHED_CANONICAL");
  assert.equal(p.authority.publication_authorized, true);
  assert.equal(p.authority.system_self_authorizing, false);
  assert.equal(p.authority.institutional_effect, "public_inheritance_only");
  assert.equal(p.source_of_truth.public_surface_is_authoritative_source, false);
});

test("CIT learning projection does not claim production or institutional authority", () => {
  const p = json(LEARNING);
  assert.equal(p.public_deployment_authorized, false);
  assert.equal(p.production_route_authorized, false);
  assert.equal(p.source.repository, "sovereign-codex/Tyme-Lab");
  assert.match(p.source.commit, /^[a-f0-9]{40}$/);
});

test("public contribution route remains explicitly external to Hall receipt", () => {
  const html = readText("contribute/index.html");
  assert.ok(html.includes("https://github.com/sovereign-codex/Codex-interface-/issues"));
  assert.match(html, /does <strong>not<\/strong> create a Hall receipt/);
  assert.match(html, /GitHub account and identity rules apply/);
});

test("static Hall does not silently introduce mutable runtime handlers", () => {
  assert.equal(existsSync(resolve(ROOT, "_worker.js")), false);
  assert.equal(existsSync(resolve(ROOT, "functions")), false);
  // Any future intentional server-side runtime change must revise this
  // separately reviewed contract and use its own security/release gates.
});

test("premerge check is not a GO vote or deployment approval", () => {
  const yaml = readText(".github/workflows/tyme-hall-001-premerge.yml");
  assert.match(yaml, /pull_request:/);
  assert.match(yaml, /hall_launch_001_premerge:/);
  assert.ok(!yaml.includes("paths:"), "Required workflow cannot use paths filtering");
  assert.ok(!yaml.includes("wrangler deploy"));
  assert.ok(!yaml.includes("secrets."));
});
