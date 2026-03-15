# Specross — Project Context for Claude

> This file tells Claude about your project. Fill in the sections below before your team starts using the commands.

---

## What We're Building

<!-- Describe the product in 2–4 sentences. What is it? Who uses it? What problem does it solve? -->

---

## Tech Stack

<!-- List your languages, frameworks, and key libraries. Claude uses this when generating tech specs and scaffolds. -->

- **Language:** e.g. TypeScript / Python / Go
- **Frontend:** e.g. React, Next.js / Vue / None
- **Backend:** e.g. Node.js + Express / FastAPI / Rails
- **Database:** e.g. PostgreSQL / MongoDB / MySQL
- **Testing:** e.g. Jest + Playwright / pytest + Selenium / Cypress
- **Infrastructure:** e.g. AWS / GCP / Vercel

---

## Folder Conventions

<!-- Tell Claude where things live in your project. -->

- **Source code:** `src/`
- **Tests:** `tests/`
- **Stories:** `stories/`

### Naming conventions
- Files: `kebab-case` (e.g. `user-auth.service.ts`)
- Classes / Components: `PascalCase`
- Variables / Functions: `camelCase`

---

## Architecture Patterns

<!-- Describe how your codebase is structured so Claude generates consistent code. -->

- **Pattern:** e.g. MVC / Clean Architecture / Feature-based folders
- **API style:** e.g. REST / GraphQL / tRPC
- **Auth:** e.g. JWT in Authorization header / Session cookie / OAuth2

---

## Coding Standards

<!-- Any rules Claude should follow when generating code. -->

- Always add JSDoc / docstrings to public functions
- Prefer `const` over `let`; avoid `var`
- Use async/await over `.then()` chains
- Error responses use format: `{ error: { code: string, message: string } }`
- (Add your own standards here)

---

## Team

<!-- Optional: list role names and owners so Claude can reference them in outputs. -->

| Role | Name |
|------|------|
| BA | |
| Dev Lead | |
| QC Lead | |
| Product Owner | |

---

## Specross — How We Work

This repo uses Specross. Commands are available via Claude Code:

| Role | Command | Purpose |
|------|---------|---------|
| BA | `/ba:new-story [name]` | Create a new story |
| BA | `/ba:review [story]` | Review story for gaps |
| BA | `/ba:impact [story] [v-old] [v-new]` | Impact report on spec changes |
| Dev | `/dev:gen-tech-spec [story]` | Generate tech spec from story |
| Dev | `/dev:gen-scaffold [story]` | Generate code scaffold from tech spec |
| Dev | `/dev:review [story]` | Review implementation vs requirements |
| QC | `/qc:gen-test-cases [story]` | Generate test cases from story |
| QC | `/qc:gen-scripts [story]` | Generate automation scripts |
| QC | `/qc:bug-report [story] [TC-ID]` | Generate structured bug report |

### Story lifecycle

```
BA: /ba:new-story → fill in story.md → /ba:review
                                              ↓
                         Dev: /dev:gen-tech-spec → /dev:gen-scaffold → implement → /dev:review
                         QC:  /qc:gen-test-cases → /qc:gen-scripts  → test      → /qc:bug-report
```

### AI principles for this project

1. AI assists, humans decide. All AI output is a first draft.
2. Review all generated tech specs and test cases before treating them as final.
3. Prompts with more context produce better output — fill in this CLAUDE.md fully.
4. If output is wrong, refine and re-run the command. Don't accept poor output.
