# Sprint 1 Goal

**Sprint:** 1 | **Start:** 2026-09-22 | **Target end:** TBD

## Goal (one sentence)
Clean up confirmed dead files, close the remaining ENDPOINT_TRACKER.md gaps against the documented API contract, root-cause the login/logout session flicker, and get a structural architecture review — HIGH-tier items (#2 contract audit, #4 architecture) gate on CEO/Founder approval before implementation.

## Success looks like
- Stray log/build-artifact files removed from git tracking; verified-dead source files removed (zero references confirmed via graphify + grep, not graph-alone).
- Grooming report for full API contract audit scope delivered to CEO (#2) — implementation gated.
- Session flicker root-caused; fix (if scoped MEDIUM) implemented and security-auditor reviewed before Done.
- Architecture review findings delivered to CEO (#4) — any material restructuring gated as its own HIGH item.

## Committed stories (from backlog.md)
| # | Story | Assignee | Estimate |
|---|---|---|---|
| 1 | Remove confirmed dead log/build files from git | team-lead (direct) | S |
| 2 | Verify + remove dead source files (graph + grep confirmed) | frontend-dev, backend-node | M |
| 3 | Root-cause + fix login/logout session flicker | frontend-dev + security-auditor review | M |
| 4 | API contract audit grooming report (scope + fixes) | team-lead (findings), backend-node/frontend-dev on approved fixes | L (grooming now, implementation gated) |
| 5 | Architecture structural review | system-architect | M (review only; any restructuring is its own gated item) |
