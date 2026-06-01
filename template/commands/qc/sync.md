> Adopt the QC persona from `.claude/agents/qc.md`.

Sync test cases after a story update: $ARGUMENTS

1. Read `test/.spec-lock`. If missing: suggest `/qc:gen-test-cases $ARGUMENTS`.
2. Compare locked version vs latest in `stories/$ARGUMENTS/CHANGELOG.md`. If same: "Already up to date."
3. Read the release note and diff changes.
4. Report: which TCs are now invalid, which need updates, new TCs needed for new ACs/ECs, effort estimate.
5. Ask to update now. If yes: edit affected `test/cases/` files, create new ones, update `test-cases.md` index, bump `.spec-lock`.
