> **Agent:** Read `.claude/agents/qc.md` and adopt that persona fully before proceeding.

---

Check if the story spec has changed since the test cases were generated, and show what needs to be updated.

Story: $ARGUMENTS

## Steps

1. Read `stories/$ARGUMENTS/test/.spec-lock`. If it doesn't exist, say:
   "No spec-lock found. Run `/qc:gen-test-cases $ARGUMENTS` to generate test cases first."

   The `.spec-lock` contains the story version these test cases were based on (e.g. `v1.0.0`).

2. Read `stories/$ARGUMENTS/CHANGELOG.md` to find the latest released version.

3. Compare the locked version vs the latest version:
   - If they match → print "✅ Your test cases are up to date. No action needed." and stop.
   - If they differ → continue.

4. Read the latest release note at `stories/$ARGUMENTS/docs/release-{latest-version}.md` to understand what changed.

5. Read the current `stories/$ARGUMENTS/story.md` fully.

6. Read the current `stories/$ARGUMENTS/test/test-cases.md` fully.

7. Produce a sync report:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄  QC SYNC — $ARGUMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Your test cases: v{locked}
Latest story:    v{latest}

CHANGES SINCE YOUR LAST SYNC:
[List each changed AC or edge case, clearly described]

TEST CASES AFFECTED:
┌─────────────────────────────────────────────────────┐
│ TC     │ Status     │ Action needed                 │
├─────────────────────────────────────────────────────┤
│ TC-003 │ ❌ Invalid  │ AC changed — rewrite steps    │
│ TC-007 │ ⚠️ Partial  │ Add new assertion for X       │
│ NEW    │ ✅ Required │ Add TC for AC-05 (remember me)│
└─────────────────────────────────────────────────────┘

NEW TEST CASES TO ADD:
[For each new AC or edge case, describe the new TC(s) needed]

SCRIPTS TO UPDATE:
[If automation scripts exist, note which files need updating]

EFFORT ESTIMATE: Low / Medium / High
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

8. After the report, ask: "Would you like me to update the test cases now with these changes?"
   - If yes: update `stories/$ARGUMENTS/test/test-cases.md` — edit invalid TCs and append new TCs
   - If no: leave as-is

9. Once test cases are updated (now or manually), remind them to update `.spec-lock`:

```
When you've finished updating your test cases and scripts, update your spec-lock:

stories/$ARGUMENTS/test/.spec-lock
  → change spec-version to: {latest}
  → change synced: to today's date
```
