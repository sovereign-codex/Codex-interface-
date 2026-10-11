// This test models the existing in-page Office state renderer without a browser
// or network. It tests disclosure semantics, not production availability.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import vm from "node:vm";

const ROOT = resolve(import.meta.dirname, "..");
const html = readFileSync(resolve(ROOT, "office/index.html"), "utf8");
const state = JSON.parse(readFileSync(resolve(ROOT, "office/state.json"), "utf8"));
const inline = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline, "Office renderer inline script must exist");

function node(tag = "element") {
  return {
    tag, textContent: "", className: "", children: [],
    appendChild(child) { this.children.push(child); },
  };
}

async function render(sample) {
  const noticeParagraph = node("p");
  const elements = new Map();
  const document = {
    querySelector(sel) {
      if (sel !== "#notice p") throw new Error("Unexpected selector: " + sel);
      return noticeParagraph;
    },
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, node(id));
      return elements.get(id);
    },
    createElement(tag) { return node(tag); },
  };
  const fetch = async (url, opts) => {
    assert.equal(url, "state.json");
    assert.equal(opts.cache, "no-store");
    return { ok: true, json: async () => sample };
  };
  vm.runInNewContext(inline, { document, fetch, Date, Number, Set, Array, Promise });
  // Let both asynchronous promise callbacks complete.
  await new Promise((resolveTask) => setImmediate(resolveTask));
  const notice = elements.get("notice");
  return {
    paragraph: noticeParagraph.textContent,
    freshness: notice?.children.find((item) => item.tag === "p")?.textContent ?? "",
  };
}

test("renders an explicit warning for a 2026-09-08 stale Office snapshot", async () => {
  const value = await render(state);
  assert.match(value.freshness, /STALE PUBLIC OFFICE SNAPSHOT/);
  assert.match(value.freshness, /2026-09-08/);
  assert.match(value.freshness, /historical snapshot/);
  assert.match(value.paragraph, /read-only public projection/);
});

test("missing generated_at fails into uncertainty rather than current state", async () => {
  const record = structuredClone(state);
  delete record.generated_at;
  const result = await render(record);
  assert.match(result.freshness, /SNAPSHOT DATE UNKNOWN/);
  assert.match(result.freshness, /cannot be verified as current/);
});

test("a future timestamp reveals clock conflict", async () => {
  const record = structuredClone(state);
  record.generated_at = new Date(Date.now() + 7 * 86400000).toISOString();
  const result = await render(record);
  assert.match(result.freshness, /SNAPSHOT CLOCK CONFLICT/);
});

test("a current timestamp remains dated and expressly not live", async () => {
  const record = structuredClone(state);
  record.generated_at = new Date(Date.now() - 30000).toISOString();
  const result = await render(record);
  assert.match(result.freshness, /not a live institutional feed/);
});

test("the Office notice is available to assistive technology", () => {
  assert.match(html, /id="notice"[^>]*aria-live="polite"/);
  assert.ok(!html.includes("innerHTML"), "Office disclosure must use textContent");
});
