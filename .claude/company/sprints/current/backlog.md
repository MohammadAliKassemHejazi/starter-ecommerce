# Sprint 1 Backlog

| # | Story | Acceptance criteria | Assignee | Tier | Estimate | Status |
|---|---|---|---|---|---|---|
| 1 | Remove stray log/build-artifact files from git tracking | 15 tracked `*.log` files removed via `git rm`; `.gitignore` already covers `*.log` | team-lead | LOW | S | ✅ done |
| 2 | Verify + remove genuinely dead source files | Each candidate file has zero import/reference hits via graphify + grep before deletion; `tsc --noEmit` clean after | frontend-dev, backend-node | MEDIUM | M | ❌ blocked (verified, deletion blocked by sandbox classifier — needs Founder) |
| 3 | Root-cause login/logout session flicker | Root cause identified in auth slice / guards / httpClient interceptor / cookie issuance; fix proposed; security-auditor reviews before Done | frontend-dev | MEDIUM (HIGH if auth-design change) | M | ✅ done (security-auditor approved; Playwright screenshot outstanding — no DB in sandbox) |
| 4 | API contract audit — grooming report | Scope of remaining ENDPOINT_TRACKER.md mismatches documented with evidence; proposed fixes listed; sent to CEO before implementation | team-lead | HIGH | L | 🔎 review (report ready) |
| 5 | Architecture structural review | Layering, circular imports, shared-type consistency findings documented; any restructuring proposal separately gated | system-architect | HIGH | M | 🔎 review (report ready, incl. flagged stock race condition) |

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
