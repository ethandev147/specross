> **Agent:** Read `.claude/agents/qc.md` and adopt that persona fully before proceeding.

---

Generate a structured bug report for story: $ARGUMENTS

Parse $ARGUMENTS: `{story-slug} {TC-ID}`
- STORY = first word (e.g. `user-authentication`)
- TC_ID = second word (e.g. `TC-003`)

## Steps

1. Read `stories/{STORY}/test/test-cases.md` and find the test case matching {TC_ID}.
   If not found, stop and say clearly which TC-IDs are available.

2. Read `stories/{STORY}/story.md` to understand the related AC.

3. Read `_templates/bug-report.md` — this is the **exact output format** to follow.

4. Ask the user to provide:
   - What actually happened (actual result)
   - Steps to reproduce (if different from TC steps)
   - Environment (browser, OS, app version, test/staging/prod)
   - Screenshots, logs, or error messages (paste or describe)

5. Generate the bug report following `_templates/bug-report.md` exactly.
   Save to `stories/{STORY}/test/bugs/bug-{TC_ID}-{slug}.md`
   where `{slug}` is a short hyphenated description (e.g. `login-fails-empty-password`).

6. After saving, print:
   - "Bug report saved: `stories/{STORY}/test/bugs/bug-{TC_ID}-{slug}.md`"
   - "Share with the Dev team and link in your issue tracker."
   - "To customize the bug report format, edit `_templates/bug-report.md`"
