> **Agent:** Read `.claude/agents/qc.md` and adopt that persona fully before proceeding.

---

Generate automation test scripts for story: $ARGUMENTS

## Steps

1. Read `stories/$ARGUMENTS/test/test-cases.md` (index). If it doesn't exist, stop and say: "Test cases not found. Run `/qc:gen-test-cases $ARGUMENTS` first."
   Then read all files in `stories/$ARGUMENTS/test/cases/` to get the full TC details.

2. Read `stories/$ARGUMENTS/story.md` for business context and AC details.

3. Read `CLAUDE.md` for:
   - The testing framework in use (e.g. Playwright, Cypress, pytest, Jest, etc.)
   - Test folder conventions and file naming
   - Any existing test helpers, fixtures, or page objects to reuse

4. For each test case across all `cases/*.md` files, generate an automation script:
   - Map TC-001 → test function/block with the same ID in a comment
   - Use the testing framework specified in CLAUDE.md
   - Write realistic selectors, assertions, and setup/teardown
   - Use `// TODO:` or `# TODO:` where QC needs to fill in dynamic values (e.g. test user credentials, specific IDs)
   - Group happy path, edge case, and negative tests into separate describe/class blocks

5. Write scripts to `tests/{story-name}/` using the naming convention in CLAUDE.md. If no convention is specified, use `{story-name}.spec.{ext}`.

6. Add a `tests/{story-name}/README.md` with:
   - How to run these tests
   - Any environment variables or setup required
   - Which TC IDs each test function covers

7. Print a summary:

**Scripts generated for `$ARGUMENTS`:**

| File | TCs covered |
|------|-------------|
| tests/$ARGUMENTS/... | TC-001, TC-002, TC-003 |

**Next steps:**
1. Fill in any `// TODO` values (credentials, test data, selectors)
2. Run the suite and use `/qc:bug-report $ARGUMENTS {TC-ID}` for any failures
