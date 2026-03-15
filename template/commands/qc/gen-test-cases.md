> **Agent:** Read `.claude/agents/qc.md` and adopt that persona fully before proceeding.

---

Generate test cases for story: $ARGUMENTS

## Steps

1. Read `stories/$ARGUMENTS/story.md` fully. If it doesn't exist, stop and say:
   "Story not found. Run `/ba:new-story $ARGUMENTS` first."

2. Check that the story has complete Acceptance Criteria. If incomplete, warn the user.

3. Read `CLAUDE.md` for testing conventions, framework, and naming standards.

4. Read `_templates/test-cases.md` — this is the **exact output format** to follow.
   - Follow the TC numbering scheme, section structure, and coverage matrix from the template
   - Do not skip sections — if a section has no content, note "None for this story"

5. Check if `stories/$ARGUMENTS/test/test-cases.md` already exists. If so, warn and ask to confirm before overwriting.

6. Generate test cases following `_templates/test-cases.md` exactly, and write to `stories/$ARGUMENTS/test/test-cases.md`.
   - Fill `{{STORY_NAME}}` with the title-cased story name
   - Fill `{{STORY_SLUG}}` with `$ARGUMENTS`
   - Fill `{{DATE}}` with today's date
   - Every AC → at least 1 happy path TC + 1 negative TC
   - Every Edge Case from story.md → its own TC
   - Coverage matrix must list every AC with its TC IDs

7. Create `.spec-lock` at `stories/$ARGUMENTS/test/.spec-lock`:
   ```
   story: $ARGUMENTS
   spec-version: (current git tag or "untagged")
   generated: {today}
   ```

8. Print a coverage summary then next steps:
   - Total TCs by type (happy path / edge case / negative)
   - Any ACs that have incomplete coverage (flag as ⚠️)
   - "Next: `/qc:gen-scripts $ARGUMENTS` to generate automation scripts"
   - "To customize the TC format, edit `_templates/test-cases.md`"
