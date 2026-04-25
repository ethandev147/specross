> **Agent:** Read `.claude/agents/qc.md` and adopt that persona fully before proceeding.

---

Check if the story spec has changed since the test cases were generated, and show what needs to be updated.

Story: $ARGUMENTS

## Steps

1. Read `stories/$ARGUMENTS/test/.spec-lock`. If it doesn't exist, say:
   "No spec-lock found. Run `/qc:gen-test-cases $ARGUMENTS` to generate test cases first."

2. Read `stories/$ARGUMENTS/CHANGELOG.md` to find the latest released version.

3. Compare the locked version vs the latest version:
   - If they match → print "✅ Your test cases are up to date." and stop.
   - If they differ → continue.

4. Read the latest release note at `stories/$ARGUMENTS/docs/release-{latest-version}.md`.

5. Read `stories/$ARGUMENTS/story.md` fully.

6. Read `stories/$ARGUMENTS/test/test-cases.md` (index) and all files in `stories/$ARGUMENTS/test/cases/`.

7. Produce a sync report:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄  QC SYNC — $ARGUMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Your test cases: v{locked}
Latest story:    v{latest}

CHANGES SINCE YOUR LAST SYNC:
[Each changed AC or edge case, clearly described]

TEST CASES AFFECTED:
┌──────────────────────────────────────────────────────────┐
│ TC     │ File               │ Status     │ Action needed  │
├──────────────────────────────────────────────────────────┤
│ TC-003 │ AC-02-....md       │ ❌ Invalid  │ AC changed     │
│ TC-007 │ AC-03-....md       │ ⚠️ Partial  │ Add assertion  │
│ NEW    │ AC-05 (new file)   │ ✅ Required │ Create new     │
└──────────────────────────────────────────────────────────┘

NEW FILES TO CREATE IN cases/:
[For each new AC or EC, the filename and what TCs it needs]

EFFORT ESTIMATE: Low / Medium / High
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

8. Ask: "Would you like me to update the test case files now?"
   - If yes:
     - Edit affected files in `test/cases/`
     - Create new case files for new ACs/ECs
     - Update `test-cases.md` index (coverage matrix, run log)
     - Write `stories/$ARGUMENTS/test/.spec-lock`:
       ```
       story: $ARGUMENTS
       spec-version: {latest}
       synced: {today}
       ```
     - Print: "✅ Test cases updated and spec-lock bumped to {latest}"
   - If no:
     - Print: "Run /qc:sync $ARGUMENTS again after you've updated manually."
