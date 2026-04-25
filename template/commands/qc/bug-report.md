> **Agent:** Read `.claude/agents/qc.md` and adopt that persona fully before proceeding.

---

Generate a structured bug report for story: $ARGUMENTS

Parse $ARGUMENTS: `{story-slug} {TC-ID}`
- STORY = first word (e.g. `user-authentication`)
- TC_ID = second word (e.g. `TC-003`)

## Steps

1. Read `stories/{STORY}/test/test-cases.md` (index) to find which file in `cases/` contains {TC_ID}.
   Then read that `stories/{STORY}/test/cases/*.md` file and locate the exact test case.
   If not found, stop and list which TC-IDs are available (from the coverage matrix in test-cases.md).

2. Read `stories/{STORY}/story.md` to understand the related AC.

3. Read `_templates/bug-report.md` — this is the **exact output format** to follow.

4. Ask the user to provide:
   - What actually happened (actual result)
   - Steps to reproduce (if different from TC steps)
   - Environment (browser, OS, app version, test/staging/prod)
   - Screenshots, logs, or error messages (paste or describe)

5. Before generating, read `stories/{STORY}/story.md` and extract the full text of the AC that this TC covers.
   Also check if `stories/{STORY}/tech/tech-spec.md` exists.
   Use these to fill the **Dev Quick Context** section:
   - Paste the exact AC text from story.md
   - Link to tech-spec.md
   - Infer the likely broken area (Frontend / Backend / Database / API contract) from the TC steps and actual result

6. Generate the bug report following `_templates/bug-report.md` exactly.
   Save to `stories/{STORY}/test/bugs/bug-{TC_ID}-{slug}.md`
   where `{slug}` is a short hyphenated description (e.g. `login-fails-empty-password`).

7. After saving the bug report, update `stories/{STORY}/test/test-cases.md`:
   - In the **Test Run Log**: set {TC_ID} row → Result = `❌ Fail`, Run date = today
   - In the **Bug Reports** table: add a row with TC ID, link to the bug file, severity, Status = Open
   - In the **Summary** table: increment Fail count, decrement Pending count
   - Also update the Result field in the TC's own `cases/*.md` file to `❌ Fail`

8. Print:
   - "Bug report saved: `stories/{STORY}/test/bugs/bug-{TC_ID}-{slug}.md`"
   - "test-cases.md updated — {TC_ID} marked ❌ Fail"
   - "Share with the Dev team and link in your issue tracker."
