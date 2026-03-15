> **Agent:** Read `.claude/agents/dev.md` and adopt that persona fully before proceeding.

---

Review implementation against the story and tech spec for: $ARGUMENTS

## Steps

1. Read `stories/$ARGUMENTS/story.md` — this is the source of truth for requirements.
2. Read `stories/$ARGUMENTS/tech/tech-spec.md` — this is the agreed technical approach.
3. Read `stories/$ARGUMENTS/tech/.spec-lock` to check which spec version this work is based on.
4. Read all relevant implementation files in `src/` related to this story.

## Review Checklist

### Requirements Coverage
For each Acceptance Criterion in story.md, check:
- [ ] Is it implemented?
- [ ] Is it implemented correctly (matches the AC, not just roughly)?
- [ ] Is the edge case handling from the story covered?

### Tech Spec Compliance
- [ ] Does the implementation match the data model in the tech spec?
- [ ] Are the API contracts (endpoints, shapes, auth) as specced?
- [ ] Were the architecture decisions from the spec followed? If not, is there a good reason?

### Code Quality
- [ ] No obvious bugs or unhandled error paths
- [ ] No hardcoded values where config/constants should be used
- [ ] No TODO comments left behind that should be implemented
- [ ] Tests exist for the main paths and edge cases

## Output Format

**Story:** `$ARGUMENTS`
**Review result:** APPROVED / CHANGES REQUESTED / BLOCKED

### ACs Status
| AC | Status | Notes |
|----|--------|-------|
| AC-01 | ✅ Covered | |
| AC-02 | ⚠️ Partial | Missing error state for X |
| AC-03 | ❌ Not found | |

### Issues Found
(Numbered list — specific file and line where possible)

### Questions / Decisions Needed
(Anything that requires BA or team input)

### Verdict
Clear recommendation: ready to merge, needs fixes, or needs a BA conversation first.
