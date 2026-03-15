# Tech Spec — {{STORY_NAME}}

**Story:** stories/{{STORY_SLUG}}/story.md
**Spec version:** v1.0.0
**Author:**
**Date:** {{DATE}}
**Status:** Draft | In Review | Approved

---

## Overview

> Brief technical summary of what needs to be built and why. 2–4 sentences.

---

## Architecture & Design

> Which layers/services are involved? Describe the high-level design.

- **Layer affected:** (API / DB / UI / Background job / etc.)
- **Key design decision:** [Decision] because [rationale]
- **Data flow:**

```
[Client] → [API] → [Service] → [DB]
```

---

## Data Model Changes

> Tables, collections, or schema changes required.

| Table/Model | Field | Type | Constraint | Notes |
|-------------|-------|------|------------|-------|
| users | last_login_at | timestamp | nullable | New field |

---

## API / Interface Changes

> For each new or changed endpoint, component, or event:

### `POST /api/v1/example`
- **Auth:** Required (JWT)
- **Request:**
```json
{
  "field": "value"
}
```
- **Response 200:**
```json
{
  "id": "uuid",
  "status": "ok"
}
```
- **Errors:** 400 (validation), 401 (auth), 409 (conflict)

---

## Acceptance Criteria Mapping

> How each story AC will be technically satisfied.

| AC | Technical approach |
|----|-------------------|
| AC-01 | ... |
| AC-02 | ... |
| AC-03 | ... |

---

## Edge Cases & Error Handling

> How each edge case from the story is handled technically.

| Edge case | Handling |
|-----------|----------|
| EC-01 | Return 422 with error code `VALIDATION_FAILED` |
| EC-02 | Fallback to default value, log warning |

---

## Dependencies

> External libraries, APIs, or other stories required.

- Depends on story: [slug]
- Requires: [library / service]

---

## Out of Scope

> What is explicitly NOT being built in this tech spec.

- ...

---

## Open Questions

> Decisions that need to be made before implementation starts.

- [ ] **Q1:** [Question] — Owner: [name] — Due: [date]
- [ ] **Q2:** [Question] — Owner: [name] — Due: [date]
