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
- Conformance and contract-diff gates required before publish

Out of scope:

- Any risk scoring logic in SDKs
- Partner-side decision engines
- Alternative payload formats

---

## 2) Canonical Contract (Source of Truth)

Canonical source:

- `apps/core/app/Http/Requests/API/V1/StoreSignalRequest.php`

Machine-readable mirror (for SDK and CI usage):

- `specs/contracts/ufes-v2.store-signal-request.schema.json`

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

---

## 3) Alias Mapping Specification

SDK inputs can be ergonomic, but final payload must normalize to valid UFES v2.

| SDK API | UFES Target |
|---|---|
| `track(type, payload)` | `event_type`, `event_payload` |
| `identify(entityId, entityType)` | `primary_actor.entity_id`, `primary_actor.entity_type` |
| SDK context | `event_payload` and/or `metadata` (current backend-compatible path) |
| SDK runtime metadata | `metadata` |

### Required Normalization Pipeline

`SDK Input -> Alias Mapping -> UFES Build -> Schema Validation -> Idempotency Header Attach -> Send`

---

## 4) SDK Architecture

Monorepo package split:

- `@protegey/server` (Node, then language-equivalent server SDKs)
- `@protegey/browser` (proxy-first telemetry enricher, no long-lived API keys)
- `@protegey/core` (normalization, queueing, retry policies)
- `@protegey/contract` (UFES schema + generated validators)
- `@protegey/conformance` (shared fixtures + test harness)

Platform split policy:

- Server SDKs are authoritative ingestion clients.
- Browser SDK is not a source of record; default mode is partner-backend proxy.

---

## 5) Mandatory Invariants

These are release-blocking requirements:

- Idempotency is ON by default (attached as request header; not body contract field).
- Schema validation is blocking before send.
- Redacted logging is default; no raw sensitive payload logging.
- Timestamp normalization is enforced.
- SDKs must not emit non-UFES fields.

SDK strictness policy:

- SDKs may enforce stricter DX requirements than backend (for example requiring `primary_actor.entity_id` in strict mode), but emitted payload must remain backend-valid UFES v2.

---

## 6) Conformance Suite

Shared fixture-driven tests must run for each SDK:

- Normalization consistency (same input -> equivalent UFES output)
- Retry and idempotency behavior
- Error mapping parity
- Timestamp behavior (missing/invalid/timezone handling)
- Invalid payload blocking

No SDK release without full conformance pass.

---

## 7) Contract Diff Gate (CI)

CI must fail if contract drift is detected between backend and SDK contract package.

Minimum gate:

1. Generate or refresh canonical contract from backend validation source.
2. Compare with `specs/contracts/ufes-v2.store-signal-request.schema.json`.
3. Fail on required-field/type/enum/shape drift.

No publish when diff gate fails.

---

## 8) Security & Data Policy

- Browser SDK cannot store long-lived server API keys.
- Metadata namespace is SDK-controlled and lightweight.
- Sensitive fields must be redacted in logs and debug output.
- Payload limits must be enforced to avoid oversized requests and noisy ingestion.

---

## 9) Phase 1 Deliverables

- Node server SDK (reference implementation)
- PHP server SDK (Laravel-first wrapper)
- REST/Postman collection update
- Contract package (`@protegey/contract`)
- Conformance suite package (`@protegey/conformance`)

---

## 10) Acceptance Criteria

- All SDK emissions validate against `specs/contracts/ufes-v2.store-signal-request.schema.json`.
- Conformance suite passes for every released SDK.
- Idempotency behavior is tested and on-by-default.
- Contract diff gate is active in CI.
- No emitted payload includes non-UFES fields.
