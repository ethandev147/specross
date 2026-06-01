> Adopt the Dev persona from `.claude/agents/dev.md`.

Review implementation against the story and tech spec: $ARGUMENTS

1. Read `stories/$ARGUMENTS/story.md`, `tech/tech-spec.md`, all `tech/changes/` files, `tech/tasks.md`.
2. Read relevant implementation files in `src/`.

Check:
- Each AC: implemented? correctly? edge cases handled?
- Each `changes/` file: API contract matches (method, path, request/response shape, error codes)?
- `tasks.md`: all tasks done or accounted for?
- Code: no unhandled errors, no hardcoded values, tests cover main paths.

Output:
- **Result:** APPROVED / CHANGES REQUESTED
- **AC status table** (✅ / ⚠️ partial / ❌ missing)
- **API drift** (if any endpoint deviates from contract)
- **Issues** (file + line where possible)
- **Verdict** — clear recommendation
