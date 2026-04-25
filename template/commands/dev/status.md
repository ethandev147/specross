> **Agent:** Read `.claude/agents/dev.md` and adopt that persona fully before proceeding.

---

Scan all released stories and show Dev status.

## Steps

1. List all subdirectories under `stories/`. If empty, print "No stories released yet." and stop.

2. For each story, collect:

   a. Latest version from `stories/{story}/CHANGELOG.md` (first `## vX.Y.Z` entry).

   b. Tech spec status — check `stories/{story}/tech/.spec-lock`:
      - Not exists → `⚪ No tech spec`
      - spec-version == latest → check `tech/tasks.md` for "Dev Complete" marker:
        - Has marker → `✅ Done`
        - No marker → `🔨 In progress`
      - spec-version != latest → `🔴 Outdated ({locked} → {latest})`

3. Print:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋  DEV STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Story                   Version    Tech spec     Action
  ─────────────────────── ────────── ───────────── ──────────────────────
  create-order            v1.0.0     🔨 In progress
  user-authentication     v1.2.0     🔴 Outdated    /dev:sync
  payment-flow            v2.0.0     ✅ Done        (handed off to QC)
  export-report           v1.0.0     ⚪ No spec     /dev:gen-tech-spec
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

4. Print action shortcuts:

```
Actions needed:
  /dev:sync user-authentication
  /dev:gen-tech-spec export-report
```

If all done:
```
✅ All tech specs up to date.
```
