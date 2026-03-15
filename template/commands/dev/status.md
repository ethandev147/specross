> **Agent:** Read `.claude/agents/dev.md` and adopt that persona fully before proceeding.

---

Scan all released stories and show which ones need a tech spec sync.

## Steps

1. List all subdirectories under `stories/`. Each subdirectory is a story slug.
   If `stories/` is empty or doesn't exist, print "No stories released yet." and stop.

2. For each story folder, collect its sync status:

   a. Read `stories/{story}/CHANGELOG.md` — extract the latest version (the first `## vX.Y.Z` entry at the top). If CHANGELOG doesn't exist, mark as `unknown`.

   b. Check `stories/{story}/tech/.spec-lock`:
      - If it **doesn't exist** → status: `⚪ No tech spec`
      - If it exists → read `spec-version`
        - If `spec-version` == latest version → status: `✅ Up to date`
        - If `spec-version` != latest version → status: `🔴 Outdated  (locked: {spec-version} → latest: {latest})`

3. Print the status table:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋  DEV STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[one line per story, sorted: outdated first, then up-to-date, then no spec]

  🔴  user-authentication   v1.0.0 → v1.3.0   /dev:sync user-authentication
  🔴  create-order          v1.1.0 → v1.2.0   /dev:sync create-order
  ✅  payment-flow          v2.0.0
  ⚪  export-report                            /dev:gen-tech-spec export-report

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{N} stories need sync   {M} up to date   {K} no tech spec yet
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

4. If there are outdated stories, print a shortcut block:

```
Run these to sync:
[one line per outdated story]
  /dev:sync {story}
```

If everything is up to date, print:
```
✅  All tech specs are up to date.
```
