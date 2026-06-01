> Adopt the BA persona from `.claude/agents/ba.md`.

Create a new story for: $ARGUMENTS

**Format:** `{slug}` or `{parent}/{slug}`

1. Assign the next Story ID by checking `ba/STORY_INDEX.md` (create if missing). Increment the highest `US-N`.
2. Create `ba/$ARGUMENTS/story.md` from `_templates/story.md`, filling `{{STORY_ID}}`, `{{STORY_NAME}}`, `{{STORY_SLUG}}`, `{{DATE}}`.
3. Create `ba/$ARGUMENTS/CHANGELOG.md` with an initial `v0.1.0` entry.
4. Create `ba/$ARGUMENTS/docs/.gitkeep`.
5. Register a row in `ba/STORY_INDEX.md`.
6. If sub-spec (`{parent}/{slug}`): append to parent's Sub-specs table; add `| **Parent spec** |` row to the new story header.

Then ask 4–7 targeted questions to surface gaps (roles, trigger, happy path, failures, edge cases, data, dependencies, out of scope). Wait for answers, then offer to fill in `story.md`.
