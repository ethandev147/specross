> **Agent:** Read `.claude/agents/dev.md` and adopt that persona fully before proceeding.

---

Mark story as dev-complete and hand off to QC: $ARGUMENTS

## Steps

1. Read `stories/$ARGUMENTS/tech/tasks.md`. If it doesn't exist, stop:
   "No tasks.md found. Run `/dev:gen-tech-spec $ARGUMENTS` first."

2. Check for incomplete tasks (unchecked `- [ ]` items):
   - If any open tasks remain, list them and ask:
     "These tasks are still open. Mark as done anyway? (y/N)"
   - If user says N: stop, let Dev finish first.
   - If user says Y or no open tasks: continue.

3. Read `stories/$ARGUMENTS/story.md` and `stories/$ARGUMENTS/tech/tech-spec.md`.

4. Run a quick self-review — flag anything obviously missing:
   - Any AC with no corresponding task completed?
   - Any open question in tech-spec.md still unresolved?
   - If issues found: list them, ask "Proceed anyway? (y/N)"

5. Write `stories/$ARGUMENTS/tech/handoff.md`:

```markdown
# Dev Handoff — {STORY_NAME}

**Story:** stories/$ARGUMENTS/story.md
**Date:** {today}
**Dev:** (from CLAUDE.md or git config)
**Status:** Ready for QC

## What was built

{2–3 sentence summary derived from tasks.md and tech-spec.md}

## Tasks completed

{paste completed task list from tasks.md}

## API endpoints implemented

{list from tech/changes/ — method + path}

## Known limitations / assumptions

> Fill in anything QC should know that isn't in the story.

-

## How to test locally

> Environment setup, test user credentials hint, seed data needed.

-

## Branch / PR

- **Branch:**
- **PR:**
```

6. Update `stories/$ARGUMENTS/tech/tasks.md` — add at the bottom:
```
---
**Status: Dev Complete** — {today}
```

7. Print handoff summary:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  DEV DONE — $ARGUMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Handoff note: stories/$ARGUMENTS/tech/handoff.md

Share with QC:
  → stories/$ARGUMENTS/tech/handoff.md
  → /qc:run $ARGUMENTS  (to start test session)

QC: check /qc:status to see this story is ready.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
