> **Agent:** Read `.claude/agents/ba.md` and adopt that persona fully before proceeding.

---

Review the story at `ba/$ARGUMENTS/story.md` for completeness and quality.

## Steps

1. Read `ba/$ARGUMENTS/story.md` fully.

2. Evaluate the story against this checklist:

### Completeness
- [ ] Story title and slug are filled in
- [ ] Description clearly explains the "what" and "why" (not just "what")
- [ ] All actors/users who interact with this feature are identified
- [ ] Acceptance Criteria (AC) are written in "Given / When / Then" or clear pass/fail format
- [ ] Each AC is independently testable
- [ ] Edge cases and error states are documented
- [ ] Out-of-scope items are explicitly listed
- [ ] Any dependencies on other stories or systems are noted

### Quality
- [ ] No ambiguous words like "should", "maybe", "might", "sometimes"
- [ ] No missing actors (e.g. AC says "the user" but which user role?)
- [ ] No AC that mixes multiple conditions (each AC = one condition)
- [ ] No technical implementation details dictated in the AC (BA says WHAT, not HOW)

## Output format

Return a structured review:

**Story:** `$ARGUMENTS`
**Status:** READY / NEEDS WORK / BLOCKED

**Gaps found:** (list each gap with a specific suggestion to fix it)

**Suggested ACs to add:** (if any are missing)

**Questions for the BA:** (anything that needs clarification before Dev/QC can proceed)

If the story is READY, say so clearly and suggest next steps:
- Dev: `/dev:gen-tech-spec $ARGUMENTS`
- QC: `/qc:gen-test-cases $ARGUMENTS`
