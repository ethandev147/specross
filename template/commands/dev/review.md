> **Agent:** Read `.claude/agents/dev.md` and adopt that persona fully before proceeding.

---

Review implementation against the story and tech spec for: $ARGUMENTS

## Steps

1. Read `stories/$ARGUMENTS/story.md` — source of truth for requirements.
2. Read `stories/$ARGUMENTS/tech/tech-spec.md` — agreed technical approach.
3. Read `stories/$ARGUMENTS/tech/.spec-lock` to check which spec version this is based on.
4. Read all files in `stories/$ARGUMENTS/tech/changes/` — each API and data model change.
5. Read `stories/$ARGUMENTS/tech/tasks.md` — check which tasks are marked done vs pending.
6. Read all relevant implementation files in `src/` related to this story.

## Review Checklist

### Requirements Coverage
For each AC in story.md:
- [ ] Implemented?
- [ ] Implemented correctly (matches AC precisely)?
- [ ] Edge cases from story handled?

### Tech Spec Compliance
For each file in `tech/changes/`:
- [ ] API contract matches (method, path, request shape, response shape, error codes)?
- [ ] Data model changes applied?
- [ ] Architecture decisions followed?

### Tasks
- [ ] All tasks in `tasks.md` completed or accounted for?
- [ ] Any tasks still open that block shipping?

### Code Quality
- [ ] No unhandled error paths
- [ ] No hardcoded values
- [ ] No TODO comments that should be implemented
- [ ] Tests cover main paths and edge cases

## Output Format

**Story:** `$ARGUMENTS`
**Review result:** APPROVED / CHANGES REQUESTED / BLOCKED

### ACs Status
| AC | Status | Notes |
|----|--------|-------|
| AC-01 | ✅ Covered | |
| AC-02 | ⚠️ Partial | Missing error state for X |
| AC-03 | ❌ Not found | |

### API Changes Status
| Endpoint file | Status | Notes |
|---------------|--------|-------|
| POST-api-v1-orders.md | ✅ Matches | |
| PATCH-api-v1-orders-{id}.md | ⚠️ Drift | Response shape differs |

### Open Tasks
(List any tasks in tasks.md that are unchecked and whether they block shipping)

### Issues Found
(Numbered list — specific file and line where possible)

### Verdict
Clear recommendation: ready to merge, needs fixes, or needs a BA conversation first.
