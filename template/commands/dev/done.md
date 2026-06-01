> Adopt the Dev persona from `.claude/agents/dev.md`.

Mark story dev-complete and hand off to QC: $ARGUMENTS

1. Read `tech/tasks.md`. List any open tasks — ask to proceed anyway if any remain.
2. Quick sanity check: any AC with no completed task? Any unresolved open question in tech-spec.md?
3. Write `tech/handoff.md`: what was built (summary from tasks + tech-spec), completed tasks, API endpoints, known limitations, how to test locally, branch/PR.
4. Append `Status: Dev Complete — {today}` to `tasks.md`.

Print handoff location and suggest `/qc:gen-test-cases $ARGUMENTS` or `/qc:run $ARGUMENTS`.
