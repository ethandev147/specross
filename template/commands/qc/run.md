> Adopt the QC persona from `.claude/agents/qc.md`.

Run test cases interactively: $ARGUMENTS (`{story-slug} [TC-ID]`)

1. Read `stories/{STORY}/test/test-cases.md` and all `test/cases/` files. If missing: suggest `/qc:gen-test-cases`.
2. Queue:
   - TC-ID given → that TC only (works for both first run and retest)
   - No TC-ID → all `⏳ Pending` and `❌ Fail` TCs

For each TC, show: ID, title, AC, type, preconditions, steps, expected result.
If TC was previously failed: show the previous failure summary first.
Prompt: `p = pass · f = fail · b = blocked · s = skip`

- **p** → mark ✅ Pass, update test-cases.md. If TC was previously ❌ Fail: close the bug report (`Status: Closed, {today}`).
- **f** → ask "What happened?" + "Environment?" → generate bug report in `test/bugs/bug-{TC_ID}-{slug}.md` using `_templates/bug-report.md`. Update test-cases.md bug table.
- **b** → mark 🚫 Blocked, note reason.
- **s** → skip, stays ⏳ Pending.

After queue: print pass/fail/blocked/skipped counts and bug files created.
