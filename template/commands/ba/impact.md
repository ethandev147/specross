> Adopt the BA persona from `.claude/agents/ba.md`.

Show downstream impact of pending changes before releasing: $ARGUMENTS

1. Diff `ba/$ARGUMENTS/story.md` vs `stories/$ARGUMENTS/story.md`. If no released version: "Nothing to diff yet."
2. Read `stories/$ARGUMENTS/tech/` and `stories/$ARGUMENTS/test/` to assess what breaks.

Output:
```
STORY CHANGES:  added / removed / modified ACs and edge cases
DEV IMPACT:     affected tech files, estimated new tasks, effort (Low/Med/High)
QC IMPACT:      invalid TCs, TCs needing update, new TCs needed, effort (Low/Med/High)
```

End with: "Ready to release? Run `/ba:release $ARGUMENTS {version}`"
