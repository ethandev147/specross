Print the Specross command reference. No arguments needed.

---

Print the following help text exactly:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡  SPECROSS — Command Reference
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BUSINESS ANALYST  ──────────────────────────────────────────

  /ba:new-story {story}
    Create a new story draft — asks open questions upfront.

  /ba:review {story}
    Review draft for gaps: missing AC, vague criteria, edge cases.

  /ba:impact {story}
    Show Dev + QC impact of pending changes before releasing.

  /ba:release {story} {version}
    Promote draft to stories/. Writes CHANGELOG + release note.
    Alerts Dev/QC if their specs are now outdated.

DEVELOPER  ─────────────────────────────────────────────────

  /dev:status
    Scan all stories — tech spec status + handoff state.

  /dev:gen-tech-spec {story}
    story → tech-spec.md + changes/{api}.md + tasks.md

  /dev:review {story}
    Review implementation vs AC + API contracts + open tasks.

  /dev:sync {story}
    Story updated? Shows which tech files + tasks need updating.

  /dev:done {story}
    Mark dev complete. Creates handoff.md for QC.

QC / TESTING  ──────────────────────────────────────────────

  /qc:status
    Scan all stories — test status + handoff readiness.

  /qc:gen-test-cases {story}
    story → test-cases.md (index) + cases/AC-01-*.md (one per AC)

  /qc:run {story} [TC-ID]
    Run TCs interactively: p/f/b/s.
    Auto-creates bug reports, auto-updates test-cases.md.

  /qc:retest {story} {TC-ID}
    Retest a failed TC after a fix. Closes bug on pass.

  /qc:gen-scripts {story}
    test cases → automation scripts (framework from CLAUDE.md)

  /qc:sync {story}
    Story updated? Shows invalid TCs + new TCs to add.

  /qc:bug-report {story} {TC-ID}
    Create structured bug report with Dev quick context.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Full SDLC:
  /ba:new-story → /ba:review → /ba:release
  /dev:gen-tech-spec → implement → /dev:review → /dev:done
  /qc:gen-test-cases → /qc:run → /qc:retest (on fix)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
