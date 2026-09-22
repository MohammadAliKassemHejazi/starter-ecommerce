# Sprint 1 Backlog

| # | Story | Acceptance criteria | Assignee | Tier | Estimate | Status |
|---|---|---|---|---|---|---|
| 1 | Remove stray log/build-artifact files from git tracking | 15 tracked `*.log` files removed via `git rm`; `.gitignore` already covers `*.log` | team-lead | LOW | S | ✅ done |
| 2 | Verify + remove genuinely dead source files | Each candidate file has zero import/reference hits via graphify + grep before deletion; `tsc --noEmit` clean after | frontend-dev, backend-node | MEDIUM | M | ❌ blocked (verified, deletion blocked by sandbox classifier — needs Founder) |
| 3 | Root-cause login/logout session flicker | Root cause identified in auth slice / guards / httpClient interceptor / cookie issuance; fix proposed; security-auditor reviews before Done | frontend-dev | MEDIUM (HIGH if auth-design change) | M | ✅ done (security-auditor approved; Playwright screenshot outstanding — no DB in sandbox) |
| 4 | API contract audit — grooming report | Scope of remaining ENDPOINT_TRACKER.md mismatches documented with evidence; proposed fixes listed; sent to CEO before implementation | team-lead | HIGH | L | 🔎 review (report ready) |
| 5 | Architecture structural review | Layering, circular imports, shared-type consistency findings documented; any restructuring proposal separately gated | system-architect | HIGH | M | 🔎 review (report ready, incl. flagged stock race condition) |
| 6 | Docker up + full QA click-through + inline-fix quick bugs | Stack live via docker compose; qa-devops Playwright pass covers full feature map; BROKEN findings that are established-pattern config/one-liners fixed with tsc clean + commit, structurally bigger ones logged not fixed | team-lead, qa-devops | MEDIUM | M | ✅ done (TASK-07); admin-dashboard rows retest → #8 |
| 7 | Fix container-networking duality blocking login/register/product-detail | SSR/API-route server-side calls reach the backend via a container-internal URL; browser calls unaffected; security-auditor reviews (auth route touched) before Done | team-lead, security-auditor | MEDIUM | S | ✅ done (TASK-08, security-auditor approved) |
| 8 | Fix public categories endpoint (anonymous callers) + admin QA retest | `GET /api/public/categories` works with no auth; no PII in the public payload; security-auditor reviews (public endpoint) before Done; qa-devops completes previously NOT TESTED admin-dashboard rows + retests login/register/product-detail/cart/checkout-page | backend-node (team-lead applied), security-auditor, qa-devops | MEDIUM | M | ✅ done (TASK-09/TASK-10); 9 new BROKEN rows found → next sprint backlog, 1 CRITICAL (password-hash leak) flagged to CEO |
| 9 | Fix CRITICAL password-hash leak + admin Users-list "No users found" + login BFF proxy response shape | `GET /api/users` and admin create/update/register never return `password`; admin Users list renders real records (root cause: auth-header race, not data-binding); `pages/api/user/[...AUTH].ts` returns `{success,data}` with `accessToken`; security-auditor reviews all three (credential-exposure + auth route) before Done | backend-node/team-lead, security-auditor | MEDIUM | M | ✅ done (TASK-11, security-auditor approved, commit `e72c5ed`) |
| 10 | Fix remaining TASK-10 BROKEN rows: cart 500/no-cart + stack-trace leak, checkout pkg.name crash, stores admin `.map` crash, shipping/taxes/promotions/returns relative-fetch host bug + returns/shipping-orders 500, comments infinite spinner | Cart returns 200 empty when no Cart row exists, no error response includes a stack trace; checkout renders a guard instead of crashing with no `package` prop; stores admin renders real store list; shipping/taxes/promotions/returns admin pages hit the real backend and render data; comments page shows an empty state instead of spinning forever with no `?productId=`; `tsc --noEmit` clean both packages; each fix live-verified against the docker stack | team-lead | MEDIUM | M | ✅ done (TASK-12) |
| 11 | Order model gap — proper fix (orderNumber + total, real migration, not attribute-select stopgap) | `Order` gets `orderNumber` (unique, human-readable) + a real total field via a reusable Sequelize migration file (not `sync alter`); return/shipping controllers use real fields; migration runs clean on disposable dev DB; `tsc --noEmit` clean; live-verified against docker stack | data-architect | HIGH (Founder-directed via CEO relay, migration on disposable DB pre-approved) | M | done (TASK-13, orderNumber stored via migration, total computed from OrderItem, live-verified) |
| 12 | Subscription-expiry alert + non-payment deletion — SPEC ONLY | PRD answers: what "delete data" means (options, default-safe recommendation), hard-delete vs soft-delete/archive recommendation, admin "mark paid in cash" mechanism (extend existing package/subscription records), alert-mechanism feasibility (grep result: email/notification capability present or not), and expiry/deletion trigger mechanism (cron capability present or not). No deletion logic implemented — deletion mechanics require a separate grooming gate (data guardrail) before buildable | product-manager | HIGH (spec-only; build gate withheld) | S | in progress |

## Story detail

### #1 — Remove stray log files
**As a** maintainer **I want** stray log/build-artifact files out of git **so that** the repo doesn't track runtime noise.
**Acceptance criteria:**
1. Given `*.log` is already in `.gitignore`, When tracked log files are found, Then they are `git rm`'d (not just gitignored going forward).
**Dependencies:** — **Skills to load:** —

### #2 — Verify + remove dead source files
**As a** maintainer **I want** genuinely unreferenced source files removed **so that** the codebase has no dead weight, without breaking a working feature.
**Acceptance criteria:**
1. Given a candidate file from the graphify scan, When checked with `graphify explain` / grep for imports of its exports, Then zero references confirmed before deletion.
2. Given deletions are made, When `npx tsc --noEmit` runs on the affected package, Then it's clean.
3. Root-level tracker/plan docs (PRODUCTION_PLAN.md, ENDPOINT_TRACKER.md, DATA_CONTRACT.md, API-Endpoint-Testing-Documentation.md, PAGE_DATA_TRACKER.md, client/PAGE_INTERFACE_ROADMAP.md, client/PUBLIC_API_ENDPOINTS.md, client/TEST_SCENARIOS.md, ADMIN_SETUP.md, PAYPAL_SETUP.md) are OUT of scope — do not delete.
**Dependencies:** graphify candidate list (see daily-log). **Skills to load:** `project-graph.md`, `token-efficiency.md`.

### #3 — Login/logout session flicker
**As a** user **I want** the login/logout UI state to not flicker **so that** auth state feels stable.
**Acceptance criteria:**
1. Given the app boots or a login/logout happens, When auth state is read from Redux/cookie, Then no unauthenticated flash renders before hydration completes.
2. Given a fix is implemented, When security-auditor reviews it, Then it passes (no session/token strategy change smuggled in as a "UI fix").
3. If root cause requires an actual session/token STRATEGY change, stop and file a decision request instead of implementing.
**Dependencies:** — **Skills to load:** `token-efficiency.md`, `verification-discipline.md`.

### #4 — API contract audit grooming report
**As the CEO** **I want** the real remaining scope of API contract mismatches **so that** I can approve fixes before broad code changes.
**Acceptance criteria:**
1. Given ENDPOINT_TRACKER.md's unchecked rows, When each is checked against actual controller/service response shape and frontend consumption, Then genuine mismatches are listed with file:line evidence (not assumed).
2. Given some "checked" rows may still be non-compliant, When found, Then reported too (checkmarks aren't trusted blindly).
**Dependencies:** — **Skills to load:** `token-efficiency.md`, `api-design.md`.

### #5 — Architecture structural review
**As the CEO** **I want** a structural health check **so that** I know if the codebase needs restructuring before it grows further.
**Acceptance criteria:**
1. Given `server/` and `client/`, When reviewed for layering (controller/service/model, component/service/slice), Then violations are named with file evidence.
2. Given the `@shared`/`shared/types` pattern exists, When usage is checked, Then consistency gaps are named.
3. Any material restructuring proposal is written as options, not applied — becomes its own gated HIGH item.
**Dependencies:** graphify graph (`graphify-out/graph.json`, code-only build already done). **Skills to load:** `project-graph.md`.
