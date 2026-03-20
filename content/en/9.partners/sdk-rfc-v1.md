---
title: SDK RFC v1
description: Governance spec for Protegey SDK architecture, UFES normalization, and release gates
navigation:
  title: SDK RFC v1
---

# SDK RFC v1

## 1) Purpose & Scope

This RFC defines how Protegey SDKs are built and governed as a trusted ingestion layer.

In scope:

- SDK normalization to UFES v2 for `POST /api/v1/signals`
- SDK support for outcome feedback via `PATCH /api/v1/signals/{id}/outcome`
- Request and response contract schemas for both endpoints
- Conformance and contract-diff gates required before publish

Out of scope:

- Any risk scoring logic in SDKs
- Partner-side decision engines
- Alternative payload formats

---

## 2) Canonical Contract (Source of Truth)

### Request Contracts

| Endpoint | Backend Source | Contract Schema |
|---|---|---|
| `POST /api/v1/signals` | `StoreSignalRequest.php` | `specs/contracts/ufes-v2.store-signal-request.schema.json` |
| `PATCH /api/v1/signals/{id}/outcome` | `UpdateSignalOutcomeRequest.php` | `specs/contracts/ufes-v2.update-signal-outcome.schema.json` |

### Response Contracts

| Endpoint | Contract Schema |
|---|---|
| `POST /api/v1/signals` → 201 | `specs/contracts/ufes-v2.store-signal-response.schema.json` |
| `PATCH /api/v1/signals/{id}/outcome` → 200 | `specs/contracts/ufes-v2.update-signal-outcome-response.schema.json` |

Rule: if backend validation does not accept a field, SDKs do not emit that field.

### Canonical Payload Shape (UFES v2)

```json
{
  "schema_version": "2.0",
  "event_type": "LOGIN_FAILURE",
  "timestamp": "2026-03-20T12:00:00Z",
  "source": {},
  "primary_actor": {
    "phone": "+233241234567"
  },
  "event_payload": {
    "success": false
  },
  "metadata": {
    "sdk_name": "protegey-node",
    "sdk_version": "1.0.0"
  }
}
```

Notes:

- Backend-required root fields are: `schema_version`, `event_type`, `timestamp`, `source`, `primary_actor`.
- `primary_actor` must include at least one identifier: `phone`, `email`, `account`, or `national_id`.
- SDK metadata must be placed in `metadata` unless backend adds explicit `source.sdk`/`source.version` fields.

### SDK Validation Behavior (`additionalProperties`)

The contract schemas use `additionalProperties: false` because they are the backend truth — they define what the server accepts.

SDKs must **not** use `additionalProperties: false` as a hard rejection gate at runtime. When the SDK encounters a key not present in its embedded contract schema:

1. Strip the unknown key from the outbound payload.
2. Emit a warning log (e.g. `"Unknown field 'foo' stripped from payload — update SDK to latest contract"`).
3. Continue with the send.

This ensures SDKs degrade gracefully when partners pass fields that exist in a newer backend version than the SDK's embedded schema. Hard-failing on unknown keys would make every backend field addition a breaking change for all SDKs.

### IP Address Validator Compatibility

`source.ip_address` and `primary_actor.device.ip_address` use JSON Schema `anyOf: [{format: "ipv4"}, {format: "ipv6"}]` in the contract schema. Not all SDK-side JSON Schema validators support this pattern natively.

`@protegey/core` must include a fallback `isIp(value)` check (regex or `net.isIP()` equivalent) and the conformance suite must test IP validation across target validator engines (e.g. Ajv for Node, `justinrainbow/json-schema` for PHP).

---

## 3) Alias Mapping Specification

SDK inputs can be ergonomic, but final payload must normalize to valid UFES v2.

| SDK API | UFES Target |
|---|---|
| `track(type, payload)` | `event_type`, `event_payload` |
| `identify(entityId, entityType)` | `primary_actor.entity_id`, `primary_actor.entity_type` |
| `recordOutcome(signalId, outcome)` | `PATCH /signals/{id}/outcome` body |
| SDK context | `event_payload` and/or `metadata` (current backend-compatible path) |
| SDK runtime metadata | `metadata` |

### Required Normalization Pipeline

`SDK Input -> Alias Mapping -> UFES Build -> Schema Validation (prune unknown keys + warn) -> Idempotency Header Attach -> Send`

---

## 4) SDK Architecture

Monorepo package split:

- `@protegey/server` (Node, then language-equivalent server SDKs)
- `@protegey/browser` (proxy-first telemetry enricher, no long-lived API keys)
- `@protegey/core` (normalization, queueing, retry policies, IP validation fallback)
- `@protegey/contract` (UFES request + response schemas + generated validators)
- `@protegey/conformance` (shared fixtures + test harness)

Platform split policy:

- Server SDKs are authoritative ingestion clients.
- Browser SDK is not a source of record; default mode is partner-backend proxy.

---

## 5) Mandatory Invariants

These are release-blocking requirements:

- Idempotency is ON by default (see Section 5b for full spec).
- Schema validation runs before send — unknown keys are pruned with warning, not hard-rejected.
- Redacted logging is default; no raw sensitive payload logging.
- Timestamp normalization is enforced (ISO 8601, UTC preferred).
- SDKs must not emit non-UFES fields after pruning.

SDK strictness policy:

- SDKs may enforce stricter DX requirements than backend (for example requiring `primary_actor.entity_id` in strict mode), but emitted payload must remain backend-valid UFES v2.

### 5b) Idempotency Specification

Backend middleware: `HandleIdempotency` (already implemented).

| Parameter | Value |
|---|---|
| **Header** | `Idempotency-Key` |
| **Key format** | UUIDv7 or ULID preferred; any string up to 64 characters accepted |
| **Server dedupe scope** | `(partner_id, idempotency_key)` — keys are partner-isolated |
| **Cache TTL** | 24 hours |
| **Replay indicator** | Server returns `X-Idempotency-Replayed: true` header on cached response |
| **What gets cached** | Only 2xx responses; 4xx/5xx are never replayed |

SDK behavior:

1. **Auto-generate**: SDK generates a `Idempotency-Key` header for every `POST /signals` request using UUIDv7 (monotonic, sortable).
2. **Retry reuse**: On network timeout or 5xx, SDK retries with the **same** idempotency key. This guarantees at-most-once processing.
3. **New key on new payload**: If the partner changes the signal payload and resubmits, a new idempotency key must be generated. Reusing a key with a different payload is undefined behavior (server returns the cached response from the first payload).
4. **PATCH requests**: Outcome updates (`PATCH /signals/{id}/outcome`) should also attach idempotency keys — the same signal may receive duplicate outcome submissions from webhook retries.
5. **Opt-out**: Partners can disable auto-idempotency via `client.configure({ idempotency: false })`, but this is not recommended.

---

## 6) Conformance Suite

Shared fixture-driven tests must run for each SDK:

### Signal Ingestion (`POST /signals`)

- Normalization consistency (same input → equivalent UFES output)
- Unknown field pruning (extra keys stripped, warning logged, send succeeds)
- Identifier requirement enforcement (at least one of phone/email/account/national_id)
- Timestamp behavior (missing/invalid/timezone handling)
- Invalid payload blocking (missing required fields → error, not sent)
- IP address validation across validator engines (Ajv, justinrainbow, custom)

### Outcome Feedback (`PATCH /signals/{id}/outcome`)

- Valid outcome payloads pass schema validation
- Enum enforcement (fraud_outcome, event_outcome, fraud_type values)
- outcome_timestamp format validation (ISO 8601)

### Idempotency

- Auto-key generation on POST
- Same key reused on retry
- New key on payload change
- Opt-out configuration works

### Response Handling

- 201 response parsed against `store-signal-response.schema.json`
- 200 response parsed against `update-signal-outcome-response.schema.json`
- `score_type: "preliminary"` correctly surfaced to caller
- `ingestion_quality` block handled when present and absent
- Error responses (422, 401, 403) mapped to typed SDK exceptions

### Error Mapping Parity

- Backend error codes map to consistent SDK exception types across languages

No SDK release without full conformance pass.

---

## 7) Contract Diff Gate (CI)

CI must fail if contract drift is detected between backend and SDK contract package.

### Request Contract Gates

| Gate | Backend Source | Schema |
|---|---|---|
| Signal ingestion | `StoreSignalRequest::rules()` | `specs/contracts/ufes-v2.store-signal-request.schema.json` |
| Outcome update | `UpdateSignalOutcomeRequest::rules()` | `specs/contracts/ufes-v2.update-signal-outcome.schema.json` |

### Gate Execution

1. Generate or refresh canonical contract from backend validation source.
2. Compare with corresponding schema in `specs/contracts/`.
3. Fail on required-field/type/enum/shape drift.

Run via: `composer contract:check` (from `apps/core`) or `pnpm contract:check` (from root).

Implementation: `apps/core/scripts/check-store-signal-contract.php` — Artisan command conversion planned for robustness.

No publish when diff gate fails.

---

## 8) Security & Data Policy

- Browser SDK cannot store long-lived server API keys.
- Metadata namespace is SDK-controlled and lightweight.
- Sensitive fields (phone, email, national_id, account) must be redacted in logs and debug output. SDKs must never log raw identifier values at any log level.
- Payload limits must be enforced to avoid oversized requests and noisy ingestion.

---

## 9) Phase 1 Deliverables

- Node server SDK (reference implementation)
- PHP server SDK (Laravel-first wrapper)
- REST/Postman collection update
- Contract package (`@protegey/contract`) — includes request + response schemas for both endpoints
- Conformance suite package (`@protegey/conformance`) — includes IP validator compatibility tests
- Contract diff CI gate for both request schemas

---

## 10) Acceptance Criteria

- All SDK emissions validate against request contract schemas (after unknown-key pruning).
- SDK response types are generated from response contract schemas.
- Conformance suite passes for every released SDK (signal ingestion + outcome + idempotency + response handling).
- Idempotency behavior is tested and on-by-default per Section 5b spec.
- Contract diff gate is active in CI for both `StoreSignalRequest` and `UpdateSignalOutcomeRequest`.
- No emitted payload includes non-UFES fields after pruning.
- IP address validation works across target validator engines.
