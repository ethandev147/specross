# Specross

**One source of truth for BA, Dev, and QC — powered by Claude Code.**

---

## The problem

Picture a typical sprint:

- BA writes a story in Notion. Dev reads it, writes a tech spec in Confluence. QC reads Notion (maybe a different version), writes test cases in a spreadsheet.
- BA updates the story mid-sprint — Dev doesn't know, QC doesn't know.
- QC files a bug in Jira with no link to the AC it violates. Dev spends 30 minutes figuring out what was supposed to happen.
- Tech spec says one thing. Code does another. Tests test a third thing.

**The root cause: no single source of truth. Everyone is working from a different version of reality.**

---

## How Specross fixes it

Specross installs a set of AI slash commands into Claude Code. Every command reads from one place: the story file in your repo.

```
stories/order-management/create-order/story.md  ← BA owns this
```

- Dev runs `/dev:gen-tech-spec` → AI reads the story, generates a tech spec + one file per API endpoint + a task list
- QC runs `/qc:gen-test-cases` → AI reads the same story, generates test cases organized by AC
- BA updates the story, runs `/ba:release` → Dev and QC get an exact diff of what changed
- Dev runs `/dev:sync` → AI shows which tech files need updating
- QC runs `/qc:run` → walks through each TC, auto-creates bug reports on fail, auto-closes them on retest pass

No copy-paste. No "which version are you looking at?". No drift.

---

## Install

```bash
npx specross init
```

Run inside your project root (where `CLAUDE.md` or `.git` lives). Takes 10 seconds.

```bash
npx specross update   # pull latest commands, keeps your agent/template customizations
```

Requires Node 16+. Works with Claude Code only.

---

## Walkthrough: full sprint from scratch

### Step 1 — BA creates the story

```
/ba:new-story order-management/create-order
```

Claude creates `ba/order-management/create-order/story.md` from the template, then immediately asks clarifying questions based on the feature name:

```
📋  Open questions for: Create Order
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Which user roles can create an order? Are there permission differences?
2. What triggers the creation — a form submit, an API call, a scheduled job?
3. What does success look like — what does the user see after creating?
4. What happens if the item is out of stock at time of submit?
5. Can a user create duplicate orders? How should that be handled?
6. What data is required vs optional on the order form?
7. Is payment captured at order creation or later?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

BA answers in chat → Claude fills in `story.md` automatically.

---

### Step 2 — BA reviews and releases

```
/ba:review order-management/create-order
```

Claude checks for vague AC, missing edge cases, undefined actors. Returns a structured gap report.

```
/ba:release order-management/create-order v1.0.0
```

Story is promoted from `ba/` → `stories/`. A release note is written to `stories/.../docs/release-v1.0.0.md`. Dev and QC are notified via the output — no Slack message needed.

---

### Step 3 — Dev generates tech spec

```
/dev:gen-tech-spec order-management/create-order
```

Claude reads the story and generates:

```
stories/order-management/create-order/tech/
├── tech-spec.md               ← architecture overview, AC mapping, open questions
├── changes/
│   ├── POST-api-v1-orders.md  ← full request/response spec for this endpoint
│   ├── GET-api-v1-orders.md
│   └── data-model.md          ← schema changes with migration notes
└── tasks.md                   ← implementation task list, each task linked to an AC
```

`tasks.md` looks like:
```
## Backend
- [ ] [BE-01] Add POST /api/v1/orders controller — `OrderController` — AC: AC-01
- [ ] [BE-02] Add order validation service — `OrderService` — AC: AC-02, AC-03
- [ ] [BE-03] Add out-of-stock check — `InventoryService` — AC: AC-04

## Database
- [ ] [DB-01] Create orders table migration

## Tests
- [ ] [TEST-01] Unit tests for OrderService
- [ ] [TEST-02] Integration tests for POST /api/v1/orders
```

Dev ticks off tasks as they implement. When done:

```
/dev:review order-management/create-order
```

Claude reads the actual code in `src/`, compares against the story AC and API spec files. Flags any gaps.

```
/dev:done order-management/create-order
```

Claude checks all tasks are ticked, creates `tech/handoff.md` with a summary of what was built, known limitations, and how to set up a test environment. QC status dashboard picks this up automatically.

---

### Step 4 — QC generates and runs test cases

```
/qc:gen-test-cases order-management/create-order
```

Claude reads the story + `handoff.md` and generates:

```
stories/order-management/create-order/test/
├── test-cases.md              ← index: run log, coverage matrix, bug table
└── cases/
    ├── AC-01-create-success.md    ← happy path + negative TCs for AC-01
    ├── AC-02-validation.md        ← TCs for AC-02
    └── EC-01-out-of-stock.md      ← edge case TCs
```

TCs are numbered globally (AC-01 → TC-001–009, AC-02 → TC-010–019) so there's no confusion across files.

```
/qc:run order-management/create-order
```

Claude walks through each TC one at a time:

```
──────────────────────────────────────
TC-001 — Create order with valid items
AC: AC-01  |  Type: Happy path
──────────────────────────────────────
Preconditions:
- Logged in as Customer role
- At least 1 item in stock

Steps:
1. Navigate to /orders/new
2. Select 2 items from the catalogue
3. Click "Place Order"

Expected: Order created, user sees confirmation with order ID
──────────────────────────────────────
Result? (p = pass / f = fail / b = blocked / s = skip):
```

QC types `p` → moves to next TC.

QC types `f` → Claude asks "What happened?" + "Environment?" (2 questions, that's it) → auto-generates the bug report, updates the run log and bug table in `test-cases.md`.

```
/qc:retest order-management/create-order TC-003
```

After Dev fixes the bug — QC retests. On pass, bug report is auto-closed. `test-cases.md` updated.

---

### Step 5 — BA updates the story mid-sprint

Requirements change. BA edits `ba/order-management/create-order/story.md`.

```
/ba:impact order-management/create-order
```

Before releasing — Claude diffs the draft vs released version and shows exact impact:

```
DEV IMPACT:
  changes/POST-api-v1-orders.md → request body needs new field `priority`
  tasks.md → 1 new task estimated
  Effort: Low

QC IMPACT:
  TC-001, TC-004 → now invalid (AC-01 changed)
  1 new TC needed for priority field validation
  Effort: Low
```

```
/ba:release order-management/create-order v1.1.0
```

```
/dev:sync order-management/create-order
# Claude shows exactly what changed, offers to update tech files + tasks
# spec-lock auto-bumped to v1.1.0

/qc:sync order-management/create-order
# Claude shows which TCs are now invalid, offers to update cases/
# spec-lock auto-bumped to v1.1.0
```

---

## What gets installed

```
your-project/
├── .claude/
│   ├── commands/
│   │   ├── ba/   ← new-story · review · impact · release
│   │   ├── dev/  ← gen-tech-spec · review · sync · status · done
│   │   └── qc/   ← gen-test-cases · run · retest · gen-scripts · sync · status · bug-report
│   └── agents/
│       ├── ba.md   ← how AI thinks as BA
│       ├── dev.md  ← how AI thinks as Dev
│       └── qc.md   ← how AI thinks as QC
│
├── _templates/     ← output format (customize freely, never overwritten by update)
│   ├── story.md
│   ├── tech-spec.md
│   ├── test-cases.md
│   ├── test-case-file.md
│   └── bug-report.md
│
├── ba/             ← BA drafts (work in progress)
├── stories/        ← source of truth (released, what Dev and QC work from)
└── CLAUDE.md       ← fill in your tech stack, conventions, team info
```

---

## Customize

`npx specross update` only refreshes commands — never touches your agents or templates.

**Agents** (`agents/ba.md`, `dev.md`, `qc.md`) — change how the AI *thinks* per role: seniority level, tone, team-specific rules, red flags to watch for.

**Templates** (`_templates/`) — change what the AI *outputs*: add sections, change naming, match your team's format.

---

## Command reference

| Role | Command | What it does |
|------|---------|--------------|
| BA | `/ba:new-story {story}` | Create story + ask clarifying questions |
| BA | `/ba:review {story}` | Review for gaps before releasing |
| BA | `/ba:impact {story}` | Preview Dev/QC impact before releasing update |
| BA | `/ba:release {story} {version}` | Promote to stories/, write CHANGELOG |
| Dev | `/dev:status` | Scan all stories: spec status + handoff state |
| Dev | `/dev:gen-tech-spec {story}` | story → tech-spec + API files + tasks.md |
| Dev | `/dev:review {story}` | Check implementation vs AC + API contracts |
| Dev | `/dev:sync {story}` | Story updated? Update tech files + tasks |
| Dev | `/dev:done {story}` | Mark complete, create handoff.md for QC |
| QC | `/qc:status` | Scan all stories: handoff state + test results |
| QC | `/qc:gen-test-cases {story}` | story → test index + cases/AC-01-*.md |
| QC | `/qc:run {story} [TC-ID]` | Run TCs interactively, auto bug report on fail |
| QC | `/qc:retest {story} {TC-ID}` | Retest after fix, auto-close bug on pass |
| QC | `/qc:gen-scripts {story}` | Generate automation scripts |
| QC | `/qc:sync {story}` | Story updated? Update test cases |
| QC | `/qc:bug-report {story} {TC-ID}` | Standalone bug report with dev context |

---

## License

MIT
