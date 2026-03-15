# {{STORY_NAME}}

| Field | Value |
|-------|-------|
| **Slug** | `{{STORY_SLUG}}` |
| **Status** | Draft |
| **Owner (BA)** | |
| **Sprint** | |
| **Created** | {{DATE}} |
| **Version** | v0.1.0 |

---

## 1. Problem Statement

> Why does this feature need to exist? What pain does it solve?
> 2–3 sentences from the user's perspective. No technical language.

---

## 2. Actors

> Who interacts with this feature? Name every role explicitly.

| Actor | Description |
|-------|-------------|
| **[Role 1]** | e.g. Registered User — has completed signup |
| **[Role 2]** | e.g. Admin — manages user accounts |

---

## 3. Acceptance Criteria

> Each AC = one independently testable condition.
> Format: **Given** [context] **When** [action] **Then** [outcome].
> No "should", "might", "usually". No technical implementation details.

### AC-01 — [Short title]
**Given** ...
**When** ...
**Then** ...

### AC-02 — [Short title]
**Given** ...
**When** ...
**Then** ...

### AC-03 — [Short title]
**Given** ...
**When** ...
**Then** ...

---

## 4. Edge Cases & Error States

> What happens when things go wrong?
> Cover: invalid input, empty state, permission denied, timeout, duplicate, concurrent actions.

| # | Scenario | Expected behaviour |
|---|----------|--------------------|
| EC-01 | | |
| EC-02 | | |
| EC-03 | | |

---

## 5. Out of Scope

> Explicitly list what is NOT in this story. Prevents scope creep.

- ...
- ...

---

## 6. Dependencies

> Other stories, services, or APIs this feature depends on.

| Type | Name | Notes |
|------|------|-------|
| Story | | e.g. must be done after `user-registration` |
| Service | | e.g. requires SendGrid for email |
| API | | e.g. depends on OAuth provider |

---

## 7. Sub-specs

> Break this feature into smaller specs if needed. Each sub-spec has its own story.md, AC, and release cycle.
> Leave empty if this is already a sub-spec, or if the feature is small enough to ship as one unit.

| Sub-spec | Status | Notes |
|----------|--------|-------|
| | | |

---

## 8. Supporting Docs

> Links to wireframes, designs, emails, or notes in `docs/`.

- `docs/wireframe-v1.png`
- `docs/stakeholder-brief.md`

---

## 9. Open Questions

> Decisions that must be resolved before Dev/QC can start.

| # | Question | Owner | Due |
|---|----------|-------|-----|
| Q1 | | | |
| Q2 | | | |

---

---

## BA Review Checklist *(fill before running `/ba:review`)*

- [ ] Problem statement explains WHY, not just WHAT
- [ ] All actors are named — no ambiguous "the user"
- [ ] Each AC is independently testable by QC
- [ ] No AC contains technical implementation details
- [ ] Edge cases cover: empty state, invalid input, permission error
- [ ] Out of scope is explicitly stated
- [ ] No open questions remaining
