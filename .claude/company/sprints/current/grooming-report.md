# Grooming Report — API Contract Audit (#2) + Architecture Review (#4)

**Date:** 2026-09-22 | **Prepared by:** team-lead | **Presented by:** ceo
**Tier:** HIGH (both items)

## Our Understanding of the Goal
Finish verifying every unchecked row in `ENDPOINT_TRACKER.md` against the documented API contract (`{success, message, data}` / paginated `{items, total, page, pageSize, totalPages}`), applying the same pattern `PRODUCTION_PLAN.md` already established — not inventing a new shape. Separately, get a structural architecture review (layering, circular imports, `@shared` type consistency) to flag risk before the codebase grows further. Both are review/scoping passes; implementation on findings is gated behind this report.

## Findings & Risks — #2 API Contract Audit

**Actual scope is smaller than "audit everything from scratch."** `ENDPOINT_TRACKER.md`: 40/60 rows already checked, 20 unchecked. Spot-checked a representative sample of the unchecked rows (shop/product endpoints, category endpoints) directly against controller code and the client interceptor:

| # | Finding | Impact | Mitigation |
|---|---|---|---|
| 1 | `server/src/controllers/shop.controller.ts` `handleDelete` (route `DELETE /shop/delete/:id`, **already checked ✅ in the tracker**) returns `{ success: true, message, result }` — field is `result`, not `data`. Because `success: true` is explicit, the client's fallback auto-wrap interceptor (`client/src/utils/httpClient.ts:29`, only wraps when `success` is absent) does NOT trigger, so `response.data.data` is `undefined` on the client (`client/src/services/shopService.ts:76`, `client/src/store/slices/shopSlice.ts:97`). | Product delete's response payload is silently dropped client-side; same bug class as the 9 CRITICAL bugs already fixed in `PRODUCTION_PLAN.md`. | 1-line fix: `result` → `data: result` in `handleDelete`. LOW/MEDIUM once approved — matches the established pattern exactly, no new shape. |
| 2 | `server/src/controllers/category.controller.ts` (all 4 unchecked category rows) already returns `{success, message, data}` consistently on every handler (create/update/delete/list) — genuinely compliant, just never checked off. | None — tracker hygiene only. | Check off rows 30-35 in `ENDPOINT_TRACKER.md`, no code change. |
| 3 | `server/src/routes/shop.route.ts`: actual route is `GET /shop/get?id=` (query param), but `ENDPOINT_TRACKER.md` row 16 lists it as `GET /api/shop/get/single?id=:id` — the path in the tracker doesn't match the real route. | Doc drift only; frontend already calls the correct real path per `shopService.ts`. | Correct the tracker doc, not the code. |
| 4 | Remaining 17 unchecked rows (admin/orders date-range + items, users PUT/DELETE + role removal, articles create/update/delete, packages update/delete, public product-listing) were NOT individually spot-checked in this grooming pass — same verification method as findings #1-3 needs to be applied to each. | Unknown until checked — could be genuine bugs (like #1) or just unchecked-but-fine (like #2). | This is the remaining real work: a systematic per-row check (controller response shape vs. frontend consumption), same method demonstrated above, ~17 rows. |

**Bottom line:** this is not a from-scratch audit. It's ~17 remaining rows to individually verify with the same method already proven in this report, plus at least 1 confirmed real bug (#1) and at least 1 tracker-hygiene-only correction (#2, likely extends to more of the 17). Recommend MEDIUM-tier execution per verified row once approved (each fix mirrors an already-established pattern, not a new decision) — HIGH tier was for the *audit/scoping* decision, not because the fixes themselves are architecturally risky.

## Findings & Risks — #4 Architecture Review
system-architect review complete (review only, nothing modified). Full table below; two findings are severity-elevated beyond "structure":

| # | Area | Finding | Evidence | Severity |
|---|---|---|---|---|
| 1 | Backend layering | 8/26 domains have no service layer — controllers call `db.*` directly (Tax, Translation, Comment, Favorite, Return, Shipping, Promotion, Size) | `tax.controller.ts`, `comment.controller.ts` etc. | HIGH |
| 2 | Backend layering | `auth.controller.ts` manages `UserSession` create/list/revoke directly against `db.UserSession`, no service — security-sensitive domain with no layering | `auth.controller.ts:16,62,95` | HIGH |
| 3 | Backend layering | `store.controller.ts` bypasses its own existing `store.service.ts` for one write | `store.controller.ts:165` | MEDIUM |
| 4 | Backend layering | `auditLog.controller.ts` has a service but still makes 7 direct `db.` calls | `auditLog.controller.ts` | LOW-MEDIUM |
| 5 | Duplication | Multer cleanup-on-error + ownership check duplicated 3x/2x in `shop.controller.ts` | `shop.controller.ts:57-70,145-160,195-210,79-92,181-184` | MEDIUM |
| 6 | Duplication | `totalPages` calc duplicated instead of centralized | `shop.controller.ts:281,311` | LOW-MEDIUM |
| 7 | Error handling | 18/26 controllers hand-roll try/catch instead of using the existing centralized `errorHandler.middleware.ts` | grep-confirmed across analytics/category/comment/etc. | MEDIUM-HIGH |
| 8 | Duplication (drifted) | `payment.service.ts::handlePackagePaymentSuccess` re-implements `package.service.ts::activatePackage` — already drifted: webhook copy skips the user-exists check the original has | `payment.service.ts:293-345` vs `package.service.ts:109-169` | MEDIUM-HIGH |
| 9 | **Correctness/integrity (flagged, not a structure item)** | `handleCartPaymentSuccess` decrements `SizeItem.quantity` with **no row lock** inside the transaction — concurrent webhook deliveries can both read stale stock and both succeed, stock can go **below 0**. Directly violates CEO business rule #4 ("decrement stock atomically") and the QA regression check. | `payment.service.ts:260-281` | **HIGH — recommend its own fast-tracked story, not bundled into the restructuring option** |
| 10 | Frontend layering | 5 shared components call `services/*` directly, bypassing Redux slice/thunk pattern used elsewhere | `PackageManager.tsx`, `PackageLimits.tsx`, `UserManager.tsx`, `SuggestedProducts.tsx`, `CommentsList.tsx` | MEDIUM |
| 11 | Cross-boundary imports | None found; no import cycles project-wide | `GRAPH_REPORT.md` — clean | INFO |
| 12 | `@shared/types` | Confirmed one-off, not convention: 73 client usages vs. 8 server files (matches PRODUCTION_PLAN.md's "Also Fixed" list exactly). Shared DTOs exist for Order/Store/User/Cart/Package but corresponding server code builds ad hoc inline payloads instead. **This is structurally why the #2 contract audit keeps finding new mismatches** — nothing enforces shape agreement outside the 5 migrated types. | `grep -rl "@shared/types" server/src` → 8 files | HIGH |

### Restructuring option (NOT implemented — ADR-shaped, for Founder decision)
Root cause behind findings 1, 7, 8, 12: service layer + shared-contract layer were adopted for a handful of domains, never enforced as convention — every new endpoint has even odds of following the pattern.

- **A — Do nothing / fix opportunistically**: cheapest, guarantees this list resurfaces every few sprints. Not recommended (finding 8 shows active drift already).
- **B — Full sweep now**: services for all 8 orphaned domains + migrate all controllers to `next(error)` + wire every domain to `@shared/types` + dedupe + row-lock stock, one HIGH story, ~20 files across both stacks, needs full regression + security-auditor (touches auth session + payment webhook).
- **C — Incremental, risk-ordered (recommended)**: (1) auth session logic → auth.service, security-auditor required; (2) dedupe `activatePackage` (fixes drifted duplicate) — give it an optional `transaction` param, delete webhook copy; (3) row-lock the stock decrement (closes finding 9's integrity gap); (4) centralize error handling — route 18 controllers through `next(error)`; (5) backfill services + `@shared/types` for the remaining 7 low-risk CRUD domains, mechanical/lower-tier once 1-4 land.

**Recommendation: Option C.** Steps 1-3 are security/integrity-bearing — own HIGH-tier story, security-auditor review (session handling + payment webhook are both automatic-review triggers per CLAUDE.md). Steps 4-5 are MEDIUM once a reference implementation exists.

## Questions for the Founder
1. Approve MEDIUM-tier execution of the remaining ~17-row endpoint verification (same pattern as PRODUCTION_PLAN.md, no new contract shape) plus the 1 confirmed bug fix (`shop.controller.ts handleDelete`)?
2. Any objection to correcting `ENDPOINT_TRACKER.md` doc-only drift (route path typos, checking off genuinely-compliant rows) as part of this pass?
3. **Stock race condition (finding #9)** — recommend fast-tracking a standalone HIGH story to add row-locking to `handleCartPaymentSuccess`'s stock decrement, independent of the broader restructuring decision. This is a live correctness gap against your own business rule #4, not hypothetical. Approve as its own story now?
4. Architecture restructuring (Option A/B/C above) — approve Option C (incremental, security-auditor gated on steps 1-3) as its own future HIGH story, or hold?

## Proposed Backlog
| # | Story | Acceptance criteria (summary) | Assignee | Estimate | Skills loaded |
|---|---|---|---|---|---|
| A | Fix `shop.controller.ts handleDelete` to return `data: result` | Matches `{success, message, data}` contract; client receives delete confirmation | backend-node | S | `api-design.md`, `token-efficiency.md` |
| B | Verify remaining ~17 unchecked `ENDPOINT_TRACKER.md` rows against controller + frontend consumption | Each row gets file:line evidence; genuine mismatches fixed via the established pattern; tracker checkboxes updated to match reality | backend-node + frontend-dev pair | M | `api-design.md`, `shared-contracts.md`, `token-efficiency.md` |
| C | Row-lock stock decrement in `handleCartPaymentSuccess` (finding #9) | Concurrent webhook deliveries cannot both pass the stock check; stock cannot go below 0; regression test for concurrent decrement | backend-node + security-auditor review (payment webhook = automatic trigger) | S-M | `payment-architecture-reference.md`, `postgres-safety.md` |
| D (future, if Option C approved) | Auth session logic → `auth.service.ts`; dedupe `activatePackage`; centralize error handling; backfill `@shared/types` | Per Option C's 5 ordered steps; steps 1-3 get security-auditor review | backend-node, security-auditor | L (own sprint) | `api-design.md`, `shared-contracts.md`, `security-audit.md` |

## Explicitly OUT of Scope
- Inventing any new response shape — every fix reuses `{success, message, data}` / paginated `{items, total, page, pageSize, totalPages}`.
- Root-level tracker/plan docs are corrected for accuracy, never deleted.

## Always-Stop Items Needing Pre-Approval
None identified in the #2 audit scope so far — all findings are ordinary contract-compliance fixes on the existing pattern, not security/auth/payment/data-migration items. (Payment endpoints not yet in the unchecked-17 sample; if the remaining verification touches `POST /api/payment/process-cart` or similar, `security-auditor` review is automatic per CLAUDE.md regardless of this approval.)

## Estimated Cost Notes
None — no paid services, API usage, or infra involved.
