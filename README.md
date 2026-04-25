# Specross

**One source of truth for BA, Dev, and QC — powered by Claude Code.**

---

## The problem

```
BA  → updates story on Notion
Dev → reads Notion, writes tech spec somewhere else
QC  → reads Notion (different version), writes test cases somewhere else
Bug → filed in Jira, no link back to the original AC
```

Three roles. Three tools. Nobody reading the same thing.

BA updates a story — Dev doesn't know. QC writes test cases from memory. Tech spec drifts from the story the moment it's written. Bugs get reported without context. Dev can't reproduce them.

**The root cause is always the same: no single source of truth.**

---

## The fix

```
stories/order-management/create-order/story.md  ← everyone reads from here
```

Tech spec generated from it. Test cases generated from it. Bug reports linked back to it. `.spec-lock` tracks when someone falls behind. When BA updates the story — Dev and QC know exactly what changed and what needs updating.

---

## Install

```bash
npx specross init
```

Run in your project root. Installs into `.claude/`. Requires Node 16+.

```bash
npx specross update   # update commands only, keeps your customizations
```

---

## Full SDLC

### 1. BA — write & release

```bash
/ba:new-story order-management/create-order
# creates story.md
# asks open questions upfront to clarify scope, actors, edge cases

/ba:review order-management/create-order
# checks for missing AC, vague criteria, undefined edge cases

/ba:impact order-management/create-order
# before releasing an update: shows which Dev/QC files will be affected

/ba:release order-management/create-order v1.0.0
# promotes to stories/, writes CHANGELOG + release note
# alerts Dev/QC if their specs are now outdated
```

### 2. Dev — spec to implementation

```bash
/dev:status
# scan all stories: spec status, in-progress, done, outdated

/dev:gen-tech-spec order-management/create-order
# story →
#   tech/tech-spec.md              overview + AC mapping
#   tech/changes/POST-api-v1-*.md  one file per API endpoint
#   tech/changes/data-model.md     schema changes
#   tech/tasks.md                  task list linked to ACs + .spec-lock

# implement, tick off tasks.md as you go

/dev:review order-management/create-order
# checks implementation vs AC + API contracts + open tasks

/dev:done order-management/create-order
# checks all tasks complete, creates tech/handoff.md for QC
```

### 3. QC — test & report

```bash
/qc:status
# scan all stories: handoff state + test results + failing TCs

/qc:gen-test-cases order-management/create-order
# reads story + handoff.md (env setup, known limitations)
# generates:
#   test/test-cases.md         index: run log, coverage matrix, bug table
#   test/cases/AC-01-*.md      one file per AC, all TCs inside
#   .spec-lock

/qc:run order-management/create-order
# walks through each pending TC: p / f / b / s
# on fail → asks actual result + env (2 questions only)
#         → auto-creates bug report
#         → auto-updates test-cases.md (run log, summary, bug table)

/qc:retest order-management/create-order TC-003
# after Dev fixes: retest the TC
# on pass → auto-closes bug report, updates test-cases.md
```

### 4. BA updates story — everyone syncs

```bash
/ba:impact order-management/create-order     # preview impact first
/ba:release order-management/create-order v1.1.0

/dev:sync order-management/create-order
# shows what changed → update? yes → updates tech files + tasks + spec-lock auto

/qc:sync order-management/create-order
# shows which TCs invalid → update? yes → updates cases/ + index + spec-lock auto
```

---

## What gets installed

```
your-project/
├── .claude/
│   ├── commands/
│   │   ├── ba/   ← new-story · review · impact · release
│   │   ├── dev/  ← gen-tech-spec · review · sync · status · done
│   │   └── qc/   ← gen-test-cases · run · retest · gen-scripts
│   │               · sync · status · bug-report
│   └── agents/
│       ├── ba.md   ← how AI thinks as BA
│       ├── dev.md  ← how AI thinks as Dev
│       └── qc.md   ← how AI thinks as QC
│
├── _templates/     ← output format (customize freely)
│   ├── story.md
│   ├── tech-spec.md
│   ├── test-cases.md
│   ├── test-case-file.md
│   └── bug-report.md
│
├── ba/             ← BA drafts
├── stories/        ← source of truth
└── CLAUDE.md       ← your tech stack, conventions, team
```

---

## Story folder (after full cycle)

```
stories/order-management/create-order/
├── story.md                        ← source of truth
├── CHANGELOG.md
├── docs/
│   └── release-v1.0.0.md
├── tech/
│   ├── tech-spec.md
│   ├── changes/
│   │   ├── data-model.md
│   │   └── POST-api-v1-orders.md
│   ├── tasks.md                    ← Dev tracking
│   ├── handoff.md                  ← created by /dev:done
│   └── .spec-lock
└── test/
    ├── test-cases.md               ← index: run log + coverage + bugs
    ├── cases/
    │   ├── AC-01-create-success.md
    │   └── AC-02-validation.md
    ├── bugs/
    │   └── bug-TC-003-*.md
    └── .spec-lock
```

---

## Customize

`npx specross update` only refreshes commands — never touches agents or templates.

- **Agents** (`agents/ba.md`, `dev.md`, `qc.md`) — change how the AI *thinks* per role
- **Templates** (`_templates/`) — change what the AI *outputs*

---

## License

MIT
