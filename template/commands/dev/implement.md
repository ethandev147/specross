> Adopt the Dev persona from `.claude/agents/dev.md`.

Implement a task. Format: `{story-slug} {task-id}`

If task-id omitted: show `tech/tasks.md` and ask which task to work on.

1. Read `stories/{STORY}/story.md`, `tech/tech-spec.md`, `tech/tasks.md`. Locate the task.
2. Read the relevant `tech/changes/` file for this task's endpoint or data model.
3. Read `CLAUDE.md` for conventions. Read existing code in the relevant area before writing anything.
4. Implement: match the API contract exactly, write tests as part of the task.
5. Mark the task done in `tasks.md` (`- [x]`).

Print: files changed, ACs covered, tasks remaining, suggest next task or `/dev:review` if all done.
