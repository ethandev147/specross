> **Agent:** Read `.claude/agents/qc.md` and adopt that persona fully before proceeding.

---

Retest a failed TC after a bug fix: $ARGUMENTS

Parse $ARGUMENTS: `{story-slug} {TC-ID}`
- STORY = first word
- TC_ID = second word

## Steps

1. Read `stories/{STORY}/test/test-cases.md` (index).
   Find {TC_ID} in the Test Run Log — if Result is not ❌ Fail, stop:
   "TC-{ID} is not marked as failed. Nothing to retest."

2. Find the bug report file for this TC in `stories/{STORY}/test/bugs/` — look for `bug-{TC_ID}-*.md`.
   Read it to understand what was failing.

3. Read the TC detail from `stories/{STORY}/test/cases/*.md`.

4. Present the TC to QC:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔁  RETEST — {TC_ID}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Previous failure:
  {summary from bug report}

{TC steps and expected result}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Result? (p = pass / f = still failing / b = blocked):
```

5. Wait for user input:

**`p` — Pass:**
- Update `cases/*.md`: Result = ✅ Pass, Run date = today
- Update `test-cases.md` Test Run Log: Result = ✅ Pass, Run date = today
- Update Summary: Pass +1, Fail -1
- Update bug report file: set **Status: Closed**, add line `Closed: {today}`
- Update Bug Reports table in `test-cases.md`: Status → Closed

  Print:
  ```
  ✅ {TC_ID} passed. Bug closed.
     Bug report: stories/{STORY}/test/bugs/bug-{TC_ID}-*.md → Closed
  ```

**`f` — Still failing:**
- Ask: "Same issue or different? (s = same / d = different):"
  - `s`: keep existing bug report, update `Last retested: {today}` in the bug file
  - `d`: create a new bug report file for this TC (same flow as `/qc:bug-report`)
- Keep Result = ❌ Fail in all index files

  Print:
  ```
  ❌ {TC_ID} still failing. Bug remains open.
  ```

**`b` — Blocked:**
- Update Result = 🚫 Blocked in cases/*.md and test-cases.md
- Ask: "What is blocking?"
- Note it in the bug report file

6. After updating, print final status of this story's test run:
```
{STORY} test status: ✅ {N} · ❌ {N} · ⏳ {N} · 🚫 {N}
Remaining failures: {list TC IDs still failing, or "None"}
```
