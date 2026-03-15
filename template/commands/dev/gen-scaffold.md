> **Agent:** Read `.claude/agents/dev.md` and adopt that persona fully before proceeding.

---

Generate a code scaffold for story: $ARGUMENTS

## Steps

1. Read `stories/$ARGUMENTS/tech/tech-spec.md`. If it doesn't exist, stop and say: "Tech spec not found. Run `/dev:gen-tech-spec $ARGUMENTS` first."

2. Read `stories/$ARGUMENTS/story.md` for business context.

3. Read `CLAUDE.md` for the project's tech stack, folder conventions, coding standards, and naming rules.

4. Analyse the tech spec and identify all files that need to be created or modified:
   - New files (controllers, services, models, components, tests, etc.)
   - Existing files that need changes (router registration, DI container, etc.)

5. For each file, generate the scaffold:
   - **Include:** function/method signatures, class/interface definitions, inline TODO comments for business logic
   - **Do not include:** full implementations — leave logic as `// TODO: implement` or `pass`
   - **Do include:** imports, type hints/interfaces, error handling stubs, and docstrings/JSDoc

6. Write files to the appropriate locations under `src/` (or the project's source folder as defined in CLAUDE.md).

7. Also create stub test files under `tests/` that match the scaffold — one test file per implementation file, with `describe` / `it` blocks pre-filled from the AC mapping in the tech spec but left as pending (`it.todo()` or `xit()`).

8. After generating all files, print:

**Scaffold summary for `$ARGUMENTS`:**

| File | Type | Action |
|------|------|--------|
| src/... | Controller | Created |
| src/... | Service | Created |
| tests/... | Unit test | Created |

**Next steps:**
1. Fill in the `// TODO` sections in each file
2. Run `/dev:review $ARGUMENTS` once implementation is done to verify all ACs are covered
