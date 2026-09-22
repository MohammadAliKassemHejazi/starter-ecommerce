# Resume Point

**Last updated:** 2026-09-22 (password-hash leak + users-list + login-proxy round) | **Sprint:** #1 | **Updated by:** team-lead

## What's done (this unit of work)
- TASK-08/TASK-09/TASK-10 (prior round, unchanged): networking + public categories fixes, admin QA pass.
- TASK-11 (`e72c5ed`, security-auditor approved) — fixed the CRITICAL password-hash leak (query-level exclude in `fetchUsersByCreator`, strip-on-return in `user.service.ts`/`users.service.ts` create/update, incl. public registration), the admin Users-list "No users found" (real root cause: auth-header race on the client, not a data-binding bug as assumed — self-corrected mid-task per team protocol), and the login BFF proxy's dropped `{success,data}`/`accessToken` envelope. Live-verified end-to-end via Playwright against the running docker-compose stack.

## What's in flight right now (the EXACT next action — not vague)
Nothing in flight. Commit `e72c5ed` pushed to origin/main. Next action: CEO relays this round's results to the Founder; on direction, next sprint grooms the 9 BROKEN admin rows from TASK-10 (cart, checkout, stores, shipping, taxes, promotions, returns, comments — none are one-liners) plus the pre-existing grooming-report.md gate (#4 API contract audit, #5 architecture review incl. HIGH stock-race-condition bug at `payment.service.ts:260-281`).

## Outstanding delegation-tier sessions (never let these go silently orphaned)
None active. security-auditor completed and reported back this round (APPROVE, no blockers).

## Pending questions / decisions blocking progress
1. security-auditor recommends a future HIGH-tier auth/session-design review (migrating to httpOnly-cookie-only auth, removing the client-JS-readable bearer token entirely) — Always-Stop per guardrail 4, routed to CEO/Founder, not actioned this round.
2. Non-blocking follow-ups filed, not fixed: (a) `httpClient.ts` accumulates a new `interceptors.request.use(...)` registration on every login/session-fetch, never ejected (frontend-dev cleanup ticket); (b) `myUsersSlice.ts`'s `fetchUsersByCreator` has no `.rejected` case, so a future auth failure still silently leaves the list empty rather than showing an error state; (c) dev-environment note — nodemon (server) and Next dev (client) both failed to pick up bind-mounted file changes on this Windows/Docker Desktop setup mid-session, requiring manual `docker restart` on both containers to verify the fix; worth a follow-up if this recurs.
3. Still open from before (unaffected by this round): grooming-report.md gate (#4 API contract audit + #5 architecture review, incl. HIGH stock-race-condition bug) awaiting Founder decision via CEO. 9 BROKEN admin rows from TASK-10 need a proper sprint.

## Files touched, not yet committed/reviewed
None — everything this round is committed and pushed (`e72c5ed`).

## Team-Lead lock status
Valid — see `company/.teamlead.lock`.

## One-line summary for the Founder
The CRITICAL password-hash leak you were flagged on last round is fixed and security-reviewed — 4 call sites patched (admin list, admin create/update, and public registration, which was the worst since it's unauthenticated), verified live that no bcrypt hash reaches any response anymore. Along the way I found the admin Users list's "No users found" wasn't the data-binding bug it looked like — it was a timing race dropping the auth header — and fixed that plus a related login-proxy bug that was silently discarding the session token on sign-in. All three security-reviewed and approved, no blockers; one item (whether to move off client-readable bearer tokens entirely) is flagged for your decision, not acted on.
