import { DurableObject } from "cloudflare:workers";

const API_VERSION = "v0";
const THREAD_ID = "commons-bootstrap-001";
const MAX_MESSAGES = 100;
const MAX_CONTENT_CHARS = 4000;
const MAX_IDENTITY_CHARS = 120;
const ALLOWED_MESSAGE_TYPES = new Set([
  "comment",
  "question",
  "claim",
  "critique",
  "evidence_submission",
  "contradiction",
  "validation_request",
  "synthesis",
  "proposal"
]);
const ALLOWED_PARTICIPANT_CLASSES = new Set([
  "human",
  "guest_intelligence",
  "observer"
]);

function json(value, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(value, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      ...extraHeaders
    }
  });
}

function isAllowedBrowserOrigin(origin) {
  if (!origin) return false;
  if (origin === "https://tymehall.org") return true;
  return /^https:\/\/[a-z0-9-]+\.codex-interface-83q\.pages\.dev$/i.test(origin);
}

function corsHeaders(origin) {
  if (!isAllowedBrowserOrigin(origin)) return {};
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    "vary": "origin"
  };
}

function normalizeRefs(value) {
  if (!Array.isArray(value)) return [];
  const out = [];
  for (const item of value) {
    if (typeof item !== "string") continue;
    const trimmed = item.trim();
    if (!trimmed || trimmed.length > 300) continue;
    if (!out.includes(trimmed)) out.push(trimmed);
    if (out.length >= 20) break;
  }
  return out;
}

function validateMessageInput(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return "JSON object required";
  }
  const participant = input.participant;
  if (!participant || typeof participant !== "object" || Array.isArray(participant)) {
    return "participant object required";
  }
  if (!ALLOWED_PARTICIPANT_CLASSES.has(participant.participant_class)) {
    return "participant_class not allowed in bootstrap room";
  }
  if (
    typeof participant.declared_identity !== "string" ||
    !participant.declared_identity.trim() ||
    participant.declared_identity.trim().length > MAX_IDENTITY_CHARS
  ) {
    return "declared_identity is required and must be 1-120 characters";
  }
  if (!ALLOWED_MESSAGE_TYPES.has(input.message_type)) {
    return "message_type not allowed";
  }
  if (
    typeof input.content !== "string" ||
    !input.content.trim() ||
    input.content.trim().length > MAX_CONTENT_CHARS
  ) {
    return "content is required and must be 1-4000 characters";
  }
  if (
    input.parent_message_id !== undefined &&
    input.parent_message_id !== null &&
    (typeof input.parent_message_id !== "string" || input.parent_message_id.length > 100)
  ) {
    return "parent_message_id must be null or a short string";
  }
  return null;
}

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function canonicalMessageForDigest(message) {
  return JSON.stringify({
    schema_version: message.schema_version,
    message_id: message.message_id,
    thread_id: message.thread_id,
    parent_message_id: message.parent_message_id,
    participant: message.participant,
    created_at: message.created_at,
    content: message.content,
    message_type: message.message_type,
    claim_refs: message.claim_refs,
    evidence_refs: message.evidence_refs,
    source_refs: message.source_refs,
    contradiction_refs: message.contradiction_refs,
    validation_refs: message.validation_refs,
    confidence: message.confidence,
    independence_state: message.independence_state,
    signature_state: message.signature_state,
    authority_state: message.authority_state,
    limitations: message.limitations
  });
}

export class CommonsThread extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    ctx.blockConcurrencyWhile(async () => {
      this.sql.exec(`
        CREATE TABLE IF NOT EXISTS messages (
          sequence INTEGER PRIMARY KEY,
          message_id TEXT NOT NULL UNIQUE,
          parent_message_id TEXT,
          created_at TEXT NOT NULL,
          stored_at TEXT NOT NULL,
          content_digest TEXT NOT NULL,
          previous_message_id TEXT,
          previous_content_digest TEXT,
          payload_json TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_messages_message_id
          ON messages(message_id);
      `);
    });
  }

  async postMessage(input) {
    const count = this.sql.exec(
      "SELECT COUNT(*) AS n FROM messages"
    ).one().n;
    if (count >= MAX_MESSAGES) {
      return {
        ok: false,
        error: "THREAD_CAP_REACHED",
        message: "Bootstrap room reached its hard message cap."
      };
    }

    const parentId = input.parent_message_id ?? null;
    if (parentId !== null) {
      const parent = this.sql.exec(
        "SELECT message_id FROM messages WHERE message_id = ?",
        parentId
      ).toArray()[0];
      if (!parent) {
        return {
          ok: false,
          error: "PARENT_NOT_FOUND",
          message: "Reply parent does not exist in this thread."
        };
      }
    }

    const last = this.sql.exec(
      "SELECT sequence, message_id, content_digest FROM messages ORDER BY sequence DESC LIMIT 1"
    ).toArray()[0] ?? null;

    const nextSequence = last ? Number(last.sequence) + 1 : 0;
    const now = new Date().toISOString();
    const messageId = crypto.randomUUID();

    const message = {
      schema_version: "0.1",
      message_id: messageId,
      thread_id: THREAD_ID,
      parent_message_id: parentId,
      participant: {
        participant_id: "declared:" + crypto.randomUUID(),
        participant_class: input.participant.participant_class,
        declared_identity: input.participant.declared_identity.trim(),
        provider_or_operator:
          typeof input.participant.provider_or_operator === "string" &&
          input.participant.provider_or_operator.trim()
            ? input.participant.provider_or_operator.trim().slice(0, 120)
            : null,
        authentication_state: "declared",
        authentication_method: null,
        identity_evidence_refs: []
      },
      created_at: now,
      content: input.content.trim(),
      message_type: input.message_type,
      claim_refs: normalizeRefs(input.claim_refs),
      evidence_refs: normalizeRefs(input.evidence_refs),
      source_refs: normalizeRefs(input.source_refs),
      contradiction_refs: normalizeRefs(input.contradiction_refs),
      validation_refs: normalizeRefs(input.validation_refs),
      confidence: "unknown",
      independence_state: "unknown",
      signature_state: "unsigned",
      authority_state: "advisory_only",
      limitations: [
        "Identity is declared, not authenticated.",
        "Bootstrap room has no institutional authority.",
        "Message persistence does not promote message content to verified evidence."
      ]
    };

    const digest = await sha256Hex(canonicalMessageForDigest(message));

    // No awaits occur between reading the current chain head and this insert.
    // This keeps sequence and previous-digest linkage within one DO turn.
    this.sql.exec(
      `INSERT INTO messages
        (sequence, message_id, parent_message_id, created_at, stored_at,
         content_digest, previous_message_id, previous_content_digest, payload_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      nextSequence,
      message.message_id,
      message.parent_message_id,
      message.created_at,
      now,
      digest,
      last ? last.message_id : null,
      last ? last.content_digest : null,
      JSON.stringify(message)
    );

    return {
      ok: true,
      message,
      receipt: {
        receipt_id: "cfdo:" + THREAD_ID + ":" + nextSequence,
        message_id: message.message_id,
        content_digest: digest,
        digest_algorithm: "sha256",
        sequence: nextSequence,
        previous_message_id: last ? last.message_id : null,
        previous_content_digest: last ? last.content_digest : null,
        stored_at: now,
        storage_coordinate: {
          kind: "database",
          value: "cloudflare-durable-object:" + THREAD_ID + ":sequence:" + nextSequence,
          retrieval_hint: "/api/" + API_VERSION + "/threads/" + THREAD_ID + "/messages/" + message.message_id
        },
        persistence_state: "persisted"
      },
      institutional_effect: "none"
    };
  }

  getThread() {
    const rows = this.sql.exec(
      "SELECT sequence, content_digest, previous_message_id, previous_content_digest, stored_at, payload_json FROM messages ORDER BY sequence ASC"
    ).toArray();

    return {
      schema_version: "0.1",
      thread_id: THREAD_ID,
      title: "Hall collaboration bootstrap",
      status: "open",
      authority_state: "none",
      persistence_state: "persisted",
      message_cap: MAX_MESSAGES,
      messages: rows.map((row) => {
        const message = JSON.parse(row.payload_json);
        return {
          message,
          receipt: {
            receipt_id: "cfdo:" + THREAD_ID + ":" + row.sequence,
            message_id: message.message_id,
            content_digest: row.content_digest,
            digest_algorithm: "sha256",
            sequence: row.sequence,
            previous_message_id: row.previous_message_id,
            previous_content_digest: row.previous_content_digest,
            stored_at: row.stored_at,
            storage_coordinate: {
              kind: "database",
              value: "cloudflare-durable-object:" + THREAD_ID + ":sequence:" + row.sequence,
              retrieval_hint: "/api/" + API_VERSION + "/threads/" + THREAD_ID + "/messages/" + message.message_id
            },
            persistence_state: "persisted"
          }
        };
      }),
      institutional_effect: "none"
    };
  }

  getMessage(messageId) {
    const row = this.sql.exec(
      "SELECT sequence, content_digest, previous_message_id, previous_content_digest, stored_at, payload_json FROM messages WHERE message_id = ?",
      messageId
    ).toArray()[0];

    if (!row) return null;
    const message = JSON.parse(row.payload_json);
    return {
      message,
      receipt: {
        receipt_id: "cfdo:" + THREAD_ID + ":" + row.sequence,
        message_id: message.message_id,
        content_digest: row.content_digest,
        digest_algorithm: "sha256",
        sequence: row.sequence,
        previous_message_id: row.previous_message_id,
        previous_content_digest: row.previous_content_digest,
        stored_at: row.stored_at,
        storage_coordinate: {
          kind: "database",
          value: "cloudflare-durable-object:" + THREAD_ID + ":sequence:" + row.sequence,
          retrieval_hint: "/api/" + API_VERSION + "/threads/" + THREAD_ID + "/messages/" + message.message_id
        },
        persistence_state: "persisted"
      },
      institutional_effect: "none"
    };
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("origin");
    const cors = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      if (!isAllowedBrowserOrigin(origin)) {
        return json(
          { ok: false, error: "ORIGIN_NOT_ALLOWED" },
          403
        );
      }
      return new Response(null, { status: 204, headers: cors });
    }

    if (url.pathname === "/health" && request.method === "GET") {
      return json({
        service: "tyme-hall-commons-v0",
        status: "ok",
        authority_state: "none",
        writes: "bounded_single_thread",
        thread_id: THREAD_ID,
        institutional_effect: "none"
      });
    }

    const prefix = "/api/" + API_VERSION + "/threads/" + THREAD_ID;
    if (!url.pathname.startsWith(prefix)) {
      return json({ ok: false, error: "NOT_FOUND" }, 404, cors);
    }

    const stub = env.THREADS.getByName(THREAD_ID);

    if (url.pathname === prefix && request.method === "GET") {
      return json(await stub.getThread(), 200, cors);
    }

    if (url.pathname === prefix + "/messages" && request.method === "POST") {
      if (!isAllowedBrowserOrigin(origin)) {
        return json(
          {
            ok: false,
            error: "ORIGIN_NOT_ALLOWED",
            message: "Bootstrap writes are accepted only from approved Hall browser origins."
          },
          403,
          cors
        );
      }

      let input;
      try {
        const text = await request.text();
        if (text.length > 12000) {
          return json({ ok: false, error: "BODY_TOO_LARGE" }, 413, cors);
        }
        input = JSON.parse(text);
      } catch {
        return json({ ok: false, error: "INVALID_JSON" }, 400, cors);
      }

      const validationError = validateMessageInput(input);
      if (validationError) {
        return json(
          { ok: false, error: "INVALID_MESSAGE", message: validationError },
          400,
          cors
        );
      }

      const result = await stub.postMessage(input);
      return json(result, result.ok ? 201 : 409, cors);
    }

    const messagePrefix = prefix + "/messages/";
    if (url.pathname.startsWith(messagePrefix) && request.method === "GET") {
      const messageId = decodeURIComponent(url.pathname.slice(messagePrefix.length));
      if (!messageId || messageId.includes("/")) {
        return json({ ok: false, error: "INVALID_MESSAGE_ID" }, 400, cors);
      }
      const result = await stub.getMessage(messageId);
      if (!result) {
        return json({ ok: false, error: "MESSAGE_NOT_FOUND" }, 404, cors);
      }
      return json(result, 200, cors);
    }

    return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405, cors);
  }
};
