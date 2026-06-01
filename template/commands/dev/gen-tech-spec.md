> Adopt the Dev persona from `.claude/agents/dev.md`.

Generate a tech spec for story: $ARGUMENTS

1. Read `stories/$ARGUMENTS/story.md`. If missing: stop. Extract STORY_ID (e.g. `US-3`).
2. Warn if ACs are incomplete. Read `CLAUDE.md` for stack/conventions. Read `_templates/tech-spec.md`.
3. If `stories/$ARGUMENTS/tech/` already has files: warn and confirm before overwriting.

**Generate:**

`tech/tech-spec.md` — follow `_templates/tech-spec.md`. Fill STORY_ID, STORY_NAME, STORY_SLUG, DATE. Link to `changes/` files.

`tech/changes/data-model.md` — schema changes with field table and migration notes. Skip if none.

`tech/changes/{METHOD}-{path}.md` — one file per endpoint. Include: auth, request schema (fields + validation), response 200, error codes, ACs covered, edge cases. Filename: `POST-api-v1-orders.md`, `GET-api-v1-orders-{id}.md`.

`tech/tasks.md` — task IDs prefixed with STORY_ID (`US-3-BE-01`). Each task maps to an AC. Sections: Backend, Frontend, DB, Tests. Order by dependency.

`tech/.spec-lock` — story slug, STORY_ID, spec-version from CHANGELOG, generated date.

Print file list, task count by area, and suggest next: `/dev:implement $ARGUMENTS {first-task-id}`.
