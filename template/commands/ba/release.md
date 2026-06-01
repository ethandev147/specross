> Adopt the BA persona from `.claude/agents/ba.md`.

Release a story. Format: `{story-slug} {version}`

1. Read `ba/{STORY}/story.md`. If missing: stop.
2. If `stories/{STORY}/story.md` exists, diff the two and summarize what changed (ACs, edge cases, scope).
3. Prepend a `{VERSION} — {today}` entry to `ba/{STORY}/CHANGELOG.md` with changes + Dev/QC impact note.
4. Copy `ba/{STORY}/` → `stories/{STORY}/` (overwrite).
5. Write `stories/{STORY}/docs/release-{VERSION}.md` with: what's in this release, what changed, action items for Dev (`/dev:gen-tech-spec` or `/dev:sync`) and QC (`/qc:gen-test-cases` or `/qc:sync`).
6. Check `.spec-lock` files under `stories/{STORY}/tech/` and `stories/{STORY}/test/` — warn if either is behind this version.

Print git commit suggestion and the impact summary block for sharing with the team.
