> **Agent:** Read `.claude/agents/dev.md` and adopt that persona fully before proceeding.

---

Generate a technical specification for story: $ARGUMENTS

## Steps

1. Read `stories/$ARGUMENTS/story.md` fully. If it doesn't exist, stop and say:
   "Story not found. Run `/ba:new-story $ARGUMENTS` first."

2. Check that the story has complete Acceptance Criteria. If incomplete, warn the user and suggest `/ba:review $ARGUMENTS` before proceeding.

3. Read `CLAUDE.md` to understand the project's tech stack, conventions, and architecture patterns.

4. Read `_templates/tech-spec.md` — this is the **exact output format** to follow.
   - Every section in the template must appear in the output
   - Replace placeholder text with real content derived from the story
   - Do not add or remove sections unless the template instructs it

5. Check if `stories/$ARGUMENTS/tech/tech-spec.md` already exists. If it does, warn the user and ask to confirm before overwriting.

6. Generate the tech spec following `_templates/tech-spec.md` exactly, and write it to `stories/$ARGUMENTS/tech/tech-spec.md`.
   - Fill `{{STORY_NAME}}` with the title-cased story name
   - Fill `{{STORY_SLUG}}` with `$ARGUMENTS`
   - Fill `{{DATE}}` with today's date
   - Map every AC from story.md into the AC Mapping table — no AC left blank

7. Read `stories/$ARGUMENTS/CHANGELOG.md` to find the current story version (the latest `## vX.Y.Z` entry at the top). Create `.spec-lock` at `stories/$ARGUMENTS/tech/.spec-lock`:
   ```
   story: $ARGUMENTS
   spec-version: {current-story-version}
   generated: {today}
   ```

8. Print next steps:
   - "Tech spec created: `stories/$ARGUMENTS/tech/tech-spec.md`"
   - "Review it before running `/dev:gen-scaffold $ARGUMENTS`"
   - "To customize the output format, edit `_templates/tech-spec.md`"
