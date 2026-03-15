Print the Specross command reference. No arguments needed.

---

Print the following help text exactly:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡  SPECROSS — Command Reference
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BUSINESS ANALYST  ──────────────────────────────────────────

  /ba:new-story {story}
    Create a new story draft under ba/{story}/story.md
    Uses the story template — fill in AC, edge cases, scope.

  /ba:review {story}
    Review a draft story for gaps before releasing.
    Checks: missing AC, vague criteria, undefined edge cases.

  /ba:release {story} {version}
    Promote a draft to stories/ as the official released version.
    Diffs vs previous, writes CHANGELOG, alerts outdated Dev/QC specs.

  /ba:impact {story}
    Show downstream impact of a story change before releasing.
    Lists which Dev and QC artifacts will be affected.

DEVELOPER  ─────────────────────────────────────────────────

  /dev:status
    Scan all stories — show which tech specs are outdated or missing.
    Run this first thing to see what needs attention.

  /dev:gen-tech-spec {story}
    Generate a tech spec from the released story.
    Maps every AC to a technical approach. Locks spec version.

  /dev:gen-scaffold {story}
    Generate skeleton code and stub tests from the tech spec.
    Creates files in src/ and tests/ with TODOs to implement.

  /dev:review {story}
    Review your implementation against the story's AC.
    Flags gaps between code and acceptance criteria.

  /dev:sync {story}
    Show what changed in the story since your last tech spec.
    Tells you exactly which sections and code to update.

QC / TESTING  ──────────────────────────────────────────────

  /qc:status
    Scan all stories — show which test cases are outdated or missing.
    Run this first thing to see what needs attention.

  /qc:gen-test-cases {story}
    Generate test cases from the released story.
    Happy path + edge case + negative TCs for every AC. Locks spec version.

  /qc:gen-scripts {story}
    Generate automation scripts from the test cases.
    Uses the framework defined in CLAUDE.md (Playwright, Cypress, pytest…).

  /qc:sync {story}
    Show what changed in the story since your last test cases.
    Lists invalid TCs, TCs needing updates, and new TCs to add.

  /qc:bug-report {story}
    Generate a structured bug report tied to a story's AC.
    Includes repro steps, expected vs actual, AC reference.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Tip: Start with /ba:new-story → /ba:release → /dev:status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
