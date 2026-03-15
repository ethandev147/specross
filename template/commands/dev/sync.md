> **Agent:** Read `.claude/agents/dev.md` and adopt that persona fully before proceeding.

---

Check if the story spec has changed since the tech spec was generated, and show what needs to be updated.

Story: $ARGUMENTS

## Steps

1. Read `stories/$ARGUMENTS/tech/.spec-lock`. If it doesn't exist, say:
   "No spec-lock found. Run `/dev:gen-tech-spec $ARGUMENTS` to generate the tech spec first."

   The `.spec-lock` contains the story version this tech spec was based on (e.g. `v1.0.0`).

2. Read `stories/$ARGUMENTS/CHANGELOG.md` to find the latest released version.

3. Compare the locked version vs the latest version:
   - If they match → print "✅ Your tech spec is up to date. No action needed." and stop.
   - If they differ → continue.

4. Read the latest release note at `stories/$ARGUMENTS/docs/release-{latest-version}.md` to understand what changed.

5. Read the current `stories/$ARGUMENTS/story.md` fully.

6. Read the current `stories/$ARGUMENTS/tech/tech-spec.md` fully.

7. Produce a sync report:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄  DEV SYNC — $ARGUMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Your tech spec: v{locked}
Latest story:   v{latest}

CHANGES SINCE YOUR LAST SYNC:
[List each changed AC or edge case, with a clear description of what changed]

WHAT YOU NEED TO UPDATE IN YOUR TECH SPEC:
[For each change, specific guidance on which section of tech-spec.md to update]

WHAT YOU NEED TO UPDATE IN YOUR CODE:
[For each change, brief note on likely code impact — file/function level if possible]

EFFORT ESTIMATE: Low / Medium / High
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

8. After the report, ask: "Would you like me to update the tech spec now with these changes?"
   - If yes: update `stories/$ARGUMENTS/tech/tech-spec.md` with the new/changed sections
   - If no: leave it as-is

9. Once the tech spec is updated (either now or by the dev manually), remind them to update `.spec-lock`:

```
When you've finished updating your tech spec and code, update your spec-lock:

stories/$ARGUMENTS/tech/.spec-lock
  → change spec-version to: {latest}
  → change synced: to today's date
```
