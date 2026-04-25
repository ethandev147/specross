> **Agent:** Read `.claude/agents/ba.md` and adopt that persona fully before proceeding.

---

Show downstream impact of a pending story change before releasing.

Usage: `/ba:impact {story-slug}`

## Steps

1. Read `ba/$ARGUMENTS/story.md` (current draft).
2. Read `stories/$ARGUMENTS/story.md` (last released version).
   If not found: "No released version yet — nothing to diff."

3. Compare the two files directly. Identify:
   - ACs added / removed / modified
   - Edge cases added / removed / modified
   - Scope or dependency changes

4. Read `stories/$ARGUMENTS/tech/tech-spec.md` and all `tech/changes/` files (if exist).
5. Read `stories/$ARGUMENTS/tech/tasks.md` (if exists).
6. Read `stories/$ARGUMENTS/test/test-cases.md` (if exists).

7. Generate impact report:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊  IMPACT REPORT — $ARGUMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Draft vs released version

STORY CHANGES:
  Added:    [list]
  Removed:  [list]
  Modified: [list]

DEV IMPACT:
  tech-spec sections affected: [list]
  API files affected:          [list]
  New tasks estimated:         [N]
  Effort: Low / Medium / High

QC IMPACT:
  TCs now invalid:  [TC IDs]
  TCs need update:  [TC IDs]
  New TCs needed:   [N]
  Effort: Low / Medium / High

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

8. Ask: "Ready to release? Run `/ba:release $ARGUMENTS {version}` to proceed."
