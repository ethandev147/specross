> **Agent:** Read `.claude/agents/qc.md` and adopt that persona fully before proceeding.

---

Run test cases interactively for story: $ARGUMENTS

Parse $ARGUMENTS: `{story-slug} [TC-ID]`
- STORY = first word
- TC_ID = second word (optional — if provided, run only that TC; if omitted, run all pending TCs)

## Steps

1. Read `stories/{STORY}/test/test-cases.md` (index).
   If it doesn't exist, stop: "No test cases found. Run `/qc:gen-test-cases {STORY}` first."

2. Read all files in `stories/{STORY}/test/cases/` to get TC details.

3. Build the run queue:
   - If TC_ID provided → queue = [that TC only]
   - If omitted → queue = all TCs where Result = ⏳ Pending or 🚫 Blocked

   If queue is empty, print:
   ```
   ✅ No pending test cases for {STORY}.
   Run /qc:status to see overall test coverage.
   ```
   and stop.

4. Print the run plan before starting:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🧪  QC RUN — {STORY}
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   {N} test cases to run:
     TC-001  {title}
     TC-002  {title}
     ...
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Type  p = pass · f = fail · b = blocked · s = skip
   Press Enter after each result.
   ```

5. For each TC in the queue, present it one at a time:

   ```
   ──────────────────────────────────────
   {TC-ID} — {title}
   AC: {AC-ID}
   Type: {Happy path / Edge case / Negative}
   ──────────────────────────────────────
   Preconditions:
   {preconditions}

   Steps:
   {numbered steps}

   Expected result:
   {expected result}
   ──────────────────────────────────────
   Result? (p = pass / f = fail / b = blocked / s = skip):
   ```

   Wait for user input:
   - `p` → Result = ✅ Pass
   - `f` → Result = ❌ Fail — ask: "Briefly describe what happened:" then trigger bug report flow (step 6)
   - `b` → Result = 🚫 Blocked — ask: "What is blocking this TC?"
   - `s` → skip, keep as ⏳ Pending

6. **On fail (`f`)** — after collecting the actual result from the user:
   - Generate bug report file at `stories/{STORY}/test/bugs/bug-{TC_ID}-{slug}.md`
     following `_templates/bug-report.md`
   - Fill Dev Quick Context automatically (AC text, tech-spec link, infer area)
   - Do NOT ask extra questions — use TC steps as repro steps, user's description as actual result
   - Ask only: "Environment? (e.g. Chrome / staging / v1.2.0):" — one line
   - Save bug report immediately

7. After each TC result, update files immediately (don't batch):
   - `test/cases/{file}.md` → update that TC's Result and Run date fields
   - `test/test-cases.md` → update Test Run Log row, Summary counts
   - If fail: update Bug Reports table with link to bug file

8. After all TCs in the queue are done, print the run summary:

   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✅  QC RUN COMPLETE — {STORY}
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Ran:      {N}
   ✅ Pass:   {N}
   ❌ Fail:   {N}
   🚫 Blocked:{N}
   ⏳ Skipped:{N}

   {if fails > 0}
   Bug reports created:
     stories/{STORY}/test/bugs/bug-TC-XXX-....md
     ...

   {if all pass}
   🎉 All test cases passed!

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

9. If there are still pending TCs remaining (skipped or not yet run), remind:
   ```
   {N} TCs still pending — run /qc:run {STORY} to continue.
   ```
