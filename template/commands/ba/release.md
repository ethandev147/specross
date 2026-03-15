> **Agent:** Read `.claude/agents/ba.md` and adopt that persona fully before proceeding.

---

Release a story from `ba/` to `stories/`. Format: `{story-slug} {version}`

Parse $ARGUMENTS:
- STORY = first word (e.g. `user-authentication`)
- VERSION = second word (e.g. `v1.0.0`). If not provided, default to `v1.0.0` for a new story or bump the patch version of the last release.

## Steps

1. Read `ba/{STORY}/story.md`. If it doesn't exist, stop and say "Story draft not found. Run `/ba:new-story {STORY}` first."

2. Read `ba/{STORY}/CHANGELOG.md` to find the previous version (if any).

3. Determine if this is a new release (first time) or an update:
   - **New release:** `stories/{STORY}/story.md` does not exist yet
   - **Update:** `stories/{STORY}/story.md` already exists — diff it against `ba/{STORY}/story.md`

4. **If this is an UPDATE (not the first release):**
   - Read both `ba/{STORY}/story.md` (new draft) and `stories/{STORY}/story.md` (last released version)
   - Compare them directly — no git required
   - Generate a change summary covering:
     - ACs added / removed / modified
     - Edge cases added / removed / modified
     - Out-of-scope or dependency changes
     - Any section that meaningfully changed

5. Update `ba/{STORY}/CHANGELOG.md` — prepend a new entry:

```markdown
## {VERSION} — {today}

### Changes
- [List each meaningful change to the story — ACs added, edge cases updated, scope changes, etc.]

### Impact
- **Dev:** [Brief note — e.g. "New AC-05 requires token TTL changes" or "No breaking changes"]
- **QC:** [Brief note — e.g. "2 new test cases needed for AC-05" or "No impact"]
```

6. **Promote to `stories/`** — copy the full draft into the released stories folder:
   - Copy `ba/{STORY}/` → `stories/{STORY}/` (overwrite if exists)
   - This snapshot is the official version Dev and QC will work against

7. Save a release note to `stories/{STORY}/docs/release-{VERSION}.md`:

```markdown
# Release Note — {STORY} {VERSION}

**Date:** {today}
**Status:** Ready for Dev and QC

## What's in this release
[Summary of the story purpose — 2–3 sentences for context]

## What changed (vs previous version)
[For first release: "Initial story release"]
[For updates: List each AC / edge case change clearly]

## Action required

### Dev team
- [ ] Run `/dev:gen-tech-spec {STORY}` (first release)
- [ ] OR run `/dev:sync {STORY}` (update — see what changed)

### QC team
- [ ] Run `/qc:gen-test-cases {STORY}` (first release)
- [ ] OR run `/qc:sync {STORY}` (update — see what changed)

## Story location
`stories/{STORY}/story.md`
```

8. **Check for outdated specs** — after promoting to `stories/`, check who is behind:

   - Check `stories/{STORY}/tech/.spec-lock`:
     - If it exists: read `spec-version` from it
     - If `spec-version` ≠ `{VERSION}` → Dev's tech spec is outdated (locked at that version)
   - Check `stories/{STORY}/test/.spec-lock`:
     - If it exists: read `spec-version` from it
     - If `spec-version` ≠ `{VERSION}` → QC's test cases are outdated (locked at that version)

9. Create a git tag suggestion. Print:

```
✅  Story released: {STORY} {VERSION}
    Draft:    ba/{STORY}/
    Released: stories/{STORY}/

Run this to tag the version in git:
  git add ba/{STORY}/ stories/{STORY}/
  git commit -m "spec({STORY}): release {VERSION}"
  git tag spec/{STORY}/{VERSION}

Then share the release note with Dev and QC:
  📄  stories/{STORY}/docs/release-{VERSION}.md
```

   If any specs are outdated (from step 8), append an alert block:

```
⚠️  OUTDATED SPECS DETECTED
──────────────────────────────────────────
[For each outdated spec, one line:]
  🔴  Dev tech spec is on {locked-version} — run /dev:sync {STORY}
  🔴  QC test cases are on {locked-version} — run /qc:sync {STORY}
──────────────────────────────────────────
```

   If all specs are up to date (or no specs exist yet), print:
```
✅  No outdated specs.
```

10. If this is an update (not first release), also print the impact summary so the BA can paste it into their team chat:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📢  STORY UPDATE: {STORY} → {VERSION}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Change summary — bullet points]

Dev: run /dev:sync {STORY}
QC:  run /qc:sync {STORY}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
