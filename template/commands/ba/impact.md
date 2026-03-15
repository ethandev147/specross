> **Agent:** Read `.claude/agents/ba.md` and adopt that persona fully before proceeding.

---

Generate an impact report for story `$ARGUMENTS` when the spec has changed.

The full argument format is: `{story-slug} {old-version} {new-version}`
Parse $ARGUMENTS to extract:
- STORY = first word
- V_OLD = second word
- V_NEW = third word

Example: if $ARGUMENTS is `user-authentication v1.0.0 v1.1.0` then STORY=user-authentication, V_OLD=v1.0.0, V_NEW=v1.1.0

## Steps

1. Read the current `stories/{STORY}/story.md`.

2. Run: `git diff {V_OLD} {V_NEW} -- stories/{STORY}/story.md`
   to see what changed between versions. If git is not available, ask the user to paste the diff.

3. Analyse the diff and produce an impact report covering:

### Changes Summary
What was added, removed, or modified in the story spec.

### Impact on Dev
- Which parts of the tech-spec (`stories/{STORY}/tech/tech-spec.md`) are affected?
- Does the scaffold or existing code need to change?
- Effort estimate for rework: Low / Medium / High

### Impact on QC
- Which existing test cases (`stories/{STORY}/test/test-cases.md`) are now invalid or need updating?
- Are new test cases needed for the new/changed ACs?
- Effort estimate for rework: Low / Medium / High

### Recommended Actions
Ordered list of actions Dev and QC should take, with the highest-priority items first.

4. Save the report to `stories/{STORY}/docs/impact-{V_OLD}-to-{V_NEW}.md`.

5. Print a summary and remind the team to update their `.spec-lock` files in `stories/{STORY}/tech/` and `stories/{STORY}/test/` once they've applied the changes.
