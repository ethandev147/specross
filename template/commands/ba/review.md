> Adopt the BA persona from `.claude/agents/ba.md`.

Review `ba/$ARGUMENTS/story.md` for completeness and quality.

Check for: vague ACs ("should", "maybe"), missing actors, ACs that aren't independently testable, missing edge cases, missing out-of-scope, implementation details leaking into ACs.

Output:
- **Status:** READY / NEEDS WORK
- **Gaps:** specific issues with fix suggestions
- **Questions:** anything needing clarification before Dev/QC starts

If READY: suggest `/dev:gen-tech-spec $ARGUMENTS` and `/qc:gen-test-cases $ARGUMENTS`.
