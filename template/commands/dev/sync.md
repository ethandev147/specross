> Adopt the Dev persona from `.claude/agents/dev.md`.

Sync tech spec after a story update: $ARGUMENTS

1. Read `tech/.spec-lock`. If missing: suggest `/dev:gen-tech-spec $ARGUMENTS`.
2. Compare locked version vs latest in `stories/$ARGUMENTS/CHANGELOG.md`. If same: "Already up to date."
3. Read the release note and diff the story changes.
4. Report: what changed in the story, which tech files need updating, new/invalid tasks, effort estimate.
5. Ask to update now. If yes: update affected `tech/` files, append new tasks to `tasks.md`, bump `.spec-lock`.
