> **Agent:** Read `.claude/agents/dev.md` and adopt that persona fully before proceeding.

---

Generate a technical specification for story: $ARGUMENTS

## Steps

1. Read `stories/$ARGUMENTS/story.md` fully. If it doesn't exist, stop and say:
   "Story not found. Run `/ba:new-story $ARGUMENTS` first."

2. Check that the story has complete Acceptance Criteria. If incomplete, warn the user and suggest `/ba:review $ARGUMENTS` before proceeding.

3. Read `CLAUDE.md` to understand the project's tech stack, conventions, and architecture patterns.

4. Read `_templates/tech-spec.md` — this is the **exact output format** for the overview file.

5. Check if `stories/$ARGUMENTS/tech/` already has files. If it does, warn the user and ask to confirm before overwriting.

---

### Output structure to generate

```
stories/$ARGUMENTS/tech/
├── tech-spec.md          ← overview: architecture, data model, AC mapping, open questions
├── changes/
│   ├── data-model.md     ← all DB / schema changes (skip if none)
│   ├── {METHOD}-{path}.md  ← one file per new or changed API endpoint
│   │     e.g. POST-api-v1-orders.md, PATCH-api-v1-orders-{id}.md
│   └── ...
├── tasks.md              ← implementation task list for tracking
└── .spec-lock
```

**Rules for `changes/` filenames:**
- API file: `{METHOD}-{url-path-with-slashes-replaced-by-dashes}.md`
  - e.g. `POST /api/v1/orders` → `POST-api-v1-orders.md`
  - e.g. `GET /api/v1/orders/{id}` → `GET-api-v1-orders-{id}.md`
- Data model file: always `data-model.md`

---

### 6. Generate `tech/tech-spec.md` (overview)

Follow `_templates/tech-spec.md` exactly.
- Fill `{{STORY_NAME}}`, `{{STORY_SLUG}}`, `{{DATE}}`
- **API / Interface Changes section:** list only the endpoint names and link to their file in `changes/`
  - e.g. `See [changes/POST-api-v1-orders.md](changes/POST-api-v1-orders.md)`
- **Data Model section:** summarise changes, link to `changes/data-model.md`

---

### 7. Generate `tech/changes/data-model.md` (if any schema changes)

```markdown
# Data Model Changes — {{STORY_NAME}}

## {TableName}

| Field | Type | Constraint | Notes |
|-------|------|------------|-------|
| ...   | ...  | ...        | ...   |

## Migration notes
...
```

Skip this file entirely if there are no data model changes.

---

### 8. Generate one `tech/changes/{METHOD}-{path}.md` per API endpoint

```markdown
# {METHOD} {full-path}

**Auth:** Required (JWT) / Public / ...
**Summary:** One sentence on what this endpoint does.

## Request

\`\`\`json
{
  "field": "value"
}
\`\`\`

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| ...   | ...  | ...      | ...        |

## Response 200

\`\`\`json
{
  "id": "uuid"
}
\`\`\`

## Error responses

| Code | Condition |
|------|-----------|
| 400  | Validation failed |
| 401  | Unauthenticated |
| 409  | Conflict |

## AC covered
- AC-01
- AC-02

## Notes / edge cases
...
```

---

### 9. Generate `tech/tasks.md`

```markdown
# Tasks — {{STORY_NAME}}

Generated: {{DATE}}
Story: stories/$ARGUMENTS/story.md

---

## Backend

- [ ] **[BE-01]** {task title} — `{file/layer}` — _AC: AC-01_
- [ ] **[BE-02]** {task title} — `{file/layer}` — _AC: AC-02_

## Frontend (if applicable)

- [ ] **[FE-01]** {task title} — `{component}` — _AC: AC-03_

## Database / Migration

- [ ] **[DB-01]** {migration description}

## Tests

- [ ] **[TEST-01]** Unit tests for {service/function}
- [ ] **[TEST-02]** Integration tests for {endpoint}

---

## Summary

| Area | Count |
|------|-------|
| Backend | N |
| Frontend | N |
| DB | N |
| Tests | N |
| **Total** | **N** |
```

Rules:
- Each task maps to at least one AC (note it)
- Tasks must be granular enough to be completed in under a day
- Order tasks so dependencies come first

---

### 10. Write `.spec-lock`

Read `stories/$ARGUMENTS/CHANGELOG.md` for the current story version. Write `stories/$ARGUMENTS/tech/.spec-lock`:

```
story: $ARGUMENTS
spec-version: {current-story-version}
generated: {today}
```

---

### 11. Print summary

```
Tech spec generated for: $ARGUMENTS

  stories/$ARGUMENTS/tech/tech-spec.md
  stories/$ARGUMENTS/tech/changes/data-model.md   (if applicable)
  stories/$ARGUMENTS/tech/changes/{endpoint}.md   (one per API)
  stories/$ARGUMENTS/tech/tasks.md
  stories/$ARGUMENTS/tech/.spec-lock

Tasks created: {N} total ({BE} backend, {FE} frontend, {DB} db, {TEST} tests)

Next steps:
  1. Review tech-spec.md and tasks.md
  2. Assign tasks and start tracking in tasks.md
  3. Run /dev:review $ARGUMENTS once implementation is done
  4. Run /dev:sync $ARGUMENTS if the story is updated
```
