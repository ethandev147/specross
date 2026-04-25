> **Agent:** Read `.claude/agents/qc.md` and adopt that persona fully before proceeding.

---

Scan all released stories and show QC status.

## Steps

1. List all subdirectories under `stories/`. If empty, print "No stories released yet." and stop.

2. For each story, collect:

   a. Latest version from `stories/{story}/CHANGELOG.md` (first `## vX.Y.Z` entry).

   b. Dev handoff status — check `stories/{story}/tech/handoff.md`:
      - Exists → `🟢 Dev done`
      - Not exists → `⚪ Dev in progress`

   c. Test spec status — check `stories/{story}/test/.spec-lock`:
      - Not exists → `⚪ No test cases`
      - spec-version == latest → check `test/test-cases.md` Summary row:
        - All pass → `✅ All passed`
        - Has failures → `❌ {N} failing`
        - Has pending → `⏳ {N} pending`
      - spec-version != latest → `🔴 Outdated ({locked} → {latest})`

3. Print:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋  QC STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Story                   Dev         Test spec     Action
  ─────────────────────── ─────────── ───────────── ──────────────────────
  create-order            🟢 Done     ❌ 2 failing   /qc:retest
  user-authentication     🟢 Done     ⏳ 3 pending   /qc:run
  payment-flow            🟢 Done     ✅ All passed
  export-report           ⚪ In prog  ⚪ No TCs      (waiting for Dev)
  list-orders             🟢 Done     🔴 Outdated    /qc:sync
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

4. Print action shortcuts for anything that needs attention:

```
Actions needed:
  /qc:retest create-order TC-003 TC-007
  /qc:run user-authentication
  /qc:sync list-orders
```

If all done and passing:
```
✅ All stories passed QC.
```
