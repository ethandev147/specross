> Adopt the QC persona from `.claude/agents/qc.md`.

Generate test cases for story: $ARGUMENTS

1. Read `stories/$ARGUMENTS/story.md`. Warn if ACs are incomplete.
2. Read `tech/handoff.md` if it exists (known limitations, how to test locally).
3. Read `CLAUDE.md` for testing conventions. Read `_templates/test-cases.md` and `_templates/test-case-file.md`.
4. Warn if `test/` already has files.

**Generate:**

`test/cases/{AC-id}-{slug}.md` — one file per AC and edge case group. Follow `_templates/test-case-file.md`. Minimum: 1 happy path + 1 negative per AC. TC IDs globally sequential (AC-01 → TC-001–009, AC-02 → TC-010–019, EC → TC-100+). All start as `⏳ Pending`.

`test/test-cases.md` — follow `_templates/test-cases.md`. Coverage matrix, test run log (all TCs), empty bug table.

`test/.spec-lock` — story slug, spec-version from CHANGELOG, generated date.

Print file list, TC count by type, any coverage gaps, suggest `/qc:run $ARGUMENTS`.
