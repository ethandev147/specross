> **Agent:** Read `.claude/agents/qc.md` and adopt that persona fully before proceeding.

---

Scan all released stories and show which ones need a test case sync.

## Steps

1. List all subdirectories under `stories/`. Each subdirectory is a story slug.
   If `stories/` is empty or doesn't exist, print "No stories released yet." and stop.

2. For each story folder, collect its sync status:

   a. Read `stories/{story}/CHANGELOG.md` — extract the latest version (the first `## vX.Y.Z` entry at the top). If CHANGELOG doesn't exist, mark as `unknown`.

   b. Check `stories/{story}/test/.spec-lock`:
      - If it **doesn't exist** → status: `⚪ No test cases`
      - If it exists → read `spec-version`
        - If `spec-version` == latest version → status: `✅ Up to date`
        - If `spec-version` != latest version → status: `🔴 Outdated  (locked: {spec-version} → latest: {latest})`

3. Print the status table:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋  QC STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[one line per story, sorted: outdated first, then up-to-date, then no test cases]

  🔴  user-authentication   v1.0.0 → v1.3.0   /qc:sync user-authentication
  🔴  create-order          v1.1.0 → v1.2.0   /qc:sync create-order
  ✅  payment-flow          v2.0.0
  ⚪  export-report                            /qc:gen-test-cases export-report

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{N} stories need sync   {M} up to date   {K} no test cases yet
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

4. If there are outdated stories, print a shortcut block:

```
Run these to sync:
[one line per outdated story]
  /qc:sync {story}
```

If everything is up to date, print:
```
✅  All test cases are up to date.
```
