# Specross

[![npm version](https://img.shields.io/npm/v/specross.svg)](https://www.npmjs.com/package/specross)
[![npm downloads](https://img.shields.io/npm/dm/specross.svg)](https://www.npmjs.com/package/specross)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Spec-driven development (SDD) for AI coding assistants.**

---

## What Specross does

Specross is built for teams that practice SDD — where one story spec drives everything: tech design, test cases, bug reports, handoff. It installs AI slash commands into your editor, each one spec-aware and traceable back to an AC.

- BA writes and refines the spec
- Dev generates tech notes from the spec
- QC generates test cases from the spec
- When the spec changes, Dev and QC get an exact diff of what breaks

Every artifact is traceable: `TC-003 → AC-02 → US-4`. One chain, end to end.

---

## Install

```bash
npx specross init
```

Supports **Claude Code**, **Cursor**, **Windsurf**, and **Codex**. Picks up whichever tools you use.

Requires Node 16+.

---

## The SDD workflow

### Step 1 — Write the spec (BA)

```
/ba:new-story order-management/create-order
```

Assigns a Story ID (`US-1`, `US-2`, ...) and asks questions to surface gaps before writing:

```
📋  Open questions for: US-4 — Create Order
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Which roles can create an order? Any permission differences?
2. What triggers this — form submit, API call, scheduled job?
3. What does success look like from the user's perspective?
4. What happens if an item goes out of stock mid-checkout?
5. Can duplicate orders be submitted? How should that be handled?
6. Which fields are required vs optional?
7. Is payment captured at creation or later?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

BA answers → AI fills in `story.md`. Run `/ba:review` — AI checks for vague AC, missing edge cases, undefined actors.

### Step 2 — Release the spec (BA)

```
/ba:release order-management/create-order v1.0.0
```

Story moves `ba/` → `stories/`. Dev and QC work from `stories/` only — never from a draft.

### Step 3 — Design and implement (Dev)

```
/dev:gen-tech-spec order-management/create-order
```

AI reads the story and generates: architecture overview, one file per API endpoint, data model changes, and a task list — each task prefixed with the Story ID (`US-4-BE-01`, `US-4-BE-02`, ...) for full traceability.

```
/dev:implement order-management/create-order US-4-BE-01
```

AI picks up that specific task, reads the relevant API contract and AC, checks the existing codebase for patterns, then implements it. Marks the task done in `tasks.md` when finished.

When all tasks are done:

```
/dev:review order-management/create-order
```

AI reads the actual code, compares against story AC. Flags any gaps.

```
/dev:done order-management/create-order
```

Creates `handoff.md` — what was built, known limitations, test environment setup. QC picks this up automatically.

### Step 4 — Test against the spec (QC)

```
/qc:gen-test-cases order-management/create-order
```

AI generates test cases from the story, each TC-ID traceable to an AC.

```
/qc:run order-management/create-order
```

Interactive test run. `p` = pass, `f` = fail. On fail → AI generates a bug report linked to the AC. After a fix, run `/qc:run {story} TC-003` to retest — on pass, bug auto-closes.

### Step 5 — Spec changes (everyone)

```
/ba:impact order-management/create-order   # preview what breaks before releasing
/ba:release order-management/create-order v1.1.0

/dev:sync order-management/create-order    # exact diff: what tech notes need updating
/qc:sync order-management/create-order    # exact diff: which TCs are now invalid
```

No one is surprised by a spec change. No one is working from a stale version.

---

## Traceability chain

Every artifact in SDD links back to the spec:

```
US-4 (story)
 └── AC-02 — item must be in stock at time of order
      ├── US-4-BE-02 (dev task)   checkout validation in OrderService
      ├── TC-007 (test case)      out-of-stock item blocked at checkout
      └── BUG-003 (bug report)    stock check fires after payment intent
```

When a bug is filed, Dev knows exactly which AC it violated and which task was supposed to cover it.

---

## What gets installed

```
your-project/
├── .claude/commands/   (or .cursor/rules/, .windsurf/rules/, .codex/instructions/)
│   ├── ba/   ← new-story · review · impact · release
│   ├── dev/  ← review · sync · done
│   └── qc/   ← gen-test-cases · run · retest · sync · bug-report
│
├── .claude/agents/     ← ba.md · dev.md · qc.md  (role personas)
├── _templates/         ← output format  (customize freely)
│
├── ba/                 ← BA drafts (work in progress)
├── stories/            ← released specs (source of truth)
└── CLAUDE.md           ← your stack, conventions, team
```

---

## Command reference

| Role | Command | What it does |
|------|---------|--------------|
| BA | `/ba:new-story {story}` | Create spec, assign US-N ID, surface gaps with questions |
| BA | `/ba:review {story}` | Check AC completeness before releasing |
| BA | `/ba:impact {story}` | Preview Dev/QC impact before releasing an update |
| BA | `/ba:release {story} {version}` | Promote to stories/, write CHANGELOG |
| Dev | `/dev:gen-tech-spec {story}` | spec → architecture, API contracts, task list |
| Dev | `/dev:implement {story} {task-id}` | Implement a specific task against the spec |
| Dev | `/dev:review {story}` | Check implementation vs AC |
| Dev | `/dev:sync {story}` | Spec updated? Diff what tech notes need changing |
| Dev | `/dev:done {story}` | Mark complete, write handoff.md for QC |
| QC | `/qc:gen-test-cases {story}` | spec → test cases organized by AC |
| QC | `/qc:run {story} [TC-ID]` | Run TCs interactively — auto bug report on fail, auto-close on retest pass |
| QC | `/qc:sync {story}` | Spec updated? Regenerate affected test cases |

---

## Customize

`npx specross update` refreshes commands only — agents and templates are never touched.

**Agents** — tune how AI thinks per role: seniority level, tone, team conventions, what to flag.  
**Templates** — tune what AI outputs: add sections, rename fields, match your team's format.

---

## License

MIT
