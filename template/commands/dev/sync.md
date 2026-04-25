> **Agent:** Read `.claude/agents/dev.md` and adopt that persona fully before proceeding.

---

Check if the story spec has changed since the tech spec was generated, and show what needs to be updated.

Story: $ARGUMENTS

## Steps

1. Read `stories/$ARGUMENTS/tech/.spec-lock`. If it doesn't exist, say:
   "No spec-lock found. Run `/dev:gen-tech-spec $ARGUMENTS` to generate the tech spec first."

2. Read `stories/$ARGUMENTS/CHANGELOG.md` to find the latest released version.

3. Compare the locked version vs the latest version:
   - If they match → print "✅ Your tech spec is up to date." and stop.
   - If they differ → continue.

4. Read the latest release note at `stories/$ARGUMENTS/docs/release-{latest-version}.md`.

5. Read `stories/$ARGUMENTS/story.md` fully.

6. Read `stories/$ARGUMENTS/tech/tech-spec.md` and all files in `stories/$ARGUMENTS/tech/changes/`.

7. Read `stories/$ARGUMENTS/tech/tasks.md` (if exists).

8. Produce a sync report:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄  DEV SYNC — $ARGUMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Your tech spec: v{locked}
Latest story:   v{latest}

CHANGES SINCE YOUR LAST SYNC:
[Each changed AC or edge case, clearly described]

IMPACT ON TECH SPEC FILES:
  tech-spec.md          → [what section needs updating, or "no change"]
  changes/data-model.md → [what changed, or "no change"]
  changes/{endpoint}.md → [what changed per file, or list new endpoints to add]

IMPACT ON TASKS:
  tasks.md → [new tasks to add, or tasks to mark invalid]

EFFORT ESTIMATE: Low / Medium / High
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

9. Ask: "Would you like me to update the tech spec files and tasks now?"
   - If yes:
     - Update the affected files in `tech/` accordingly
     - Append new tasks to `tasks.md`
     - Write `stories/$ARGUMENTS/tech/.spec-lock`:
       ```
       story: $ARGUMENTS
       spec-version: {latest}
       synced: {today}
       ```
     - Print: "✅ Tech spec updated and spec-lock bumped to {latest}"
   - If no:
     - Print: "Run /dev:sync $ARGUMENTS again after you've updated manually."
