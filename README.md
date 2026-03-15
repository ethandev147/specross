# Specross

**Spec-driven AI collaboration for BA, Dev, and QC teams.**

```
BA writes story  →  Dev generates tech-spec + scaffold  →  ship
                 ↘  QC generates test cases + scripts   ↗
```

One story. Three roles. No drift.

---

## The problem

Specs live in Notion. Test cases live in Jira. Code lives in Git. Nobody's reading the same thing.

BA updates a story — Dev doesn't know. QC writes test cases from memory, not from AC. Tech spec drifts from the story the moment it's written.

Specross fixes this by making the story the single source of truth, and giving each role an AI command that reads directly from it.

---

## How it works

**BA** drafts a story in `ba/` — problem statement, actors, acceptance criteria, edge cases — and releases it to `stories/` when ready.

**Dev** runs `/dev:gen-tech-spec` — AI reads the story and generates a tech spec in the exact format your team uses. Then `/dev:gen-scaffold` to generate a code scaffold.

**QC** runs `/qc:gen-test-cases` — AI reads the same story and generates test cases covering every AC and edge case, with a coverage matrix.

**When BA updates the story** — `/ba:release` auto-diffs the new version against the previous one and tells Dev and QC exactly what changed. They run `/dev:sync` and `/qc:sync` to see what needs updating.

No meetings. No copy-paste. No guessing.

---

## Install

**Option 1 — npx (no install needed):**
```bash
npx specross init
```

**Option 2 — global install:**
```bash
npm install -g specross
specross init
```

Run in your project root. It asks which AI tool you're using, then copies commands and agents to the right place.

```
Which AI tool are you using?

  1. Claude Code   →  .claude/commands/  +  .claude/agents/
  2. Cursor        →  .cursor/rules/
  3. Windsurf      →  .windsurf/rules/
  4. Other         →  ai/commands/  +  ai/agents/
```

**Update commands to latest version:**
```bash
npx specross update
# or
specross update
```

Never overwrites your agent and template customizations.

**Requirements:** Node.js 16+

---

## What gets installed

```
your-project/
├── {ai-folder}/             ← commands + agents (location depends on your AI tool)
│   ├── commands/
│   │   ├── ba/              ← /ba:new-story, /ba:review, /ba:release, /ba:impact
│   │   ├── dev/             ← /dev:gen-tech-spec, /dev:gen-scaffold, /dev:review, /dev:sync
│   │   └── qc/              ← /qc:gen-test-cases, /qc:gen-scripts, /qc:bug-report, /qc:sync
│   └── agents/
│       ├── ba.md            ← HOW the AI thinks as BA
│       ├── dev.md           ← HOW the AI thinks as Dev
│       └── qc.md            ← HOW the AI thinks as QC
│
├── _templates/              ← WHAT format the AI outputs
│   ├── story.md
│   ├── tech-spec.md
│   ├── test-cases.md
│   └── bug-report.md
│
├── ba/                      ← BA draft workspace (work in progress)
├── stories/                 ← released stories (source of truth for Dev & QC)
└── CLAUDE.md                ← fill in your tech stack, team conventions, architecture
```

---

## Workflow

### BA — write and release

```bash
# Create a feature and break it into specs
/ba:new-story order-management
/ba:new-story order-management/create-order
/ba:new-story order-management/list-orders

# Review for gaps before releasing
/ba:review order-management/create-order

# Release draft → stories/ (auto-diffs if update)
/ba:release order-management/create-order v1.0.0
```

Story lives at `ba/order-management/create-order/story.md` while in draft. On release, it's promoted to `stories/` — that's the version Dev and QC work from.

---

### Dev — from story to code

```bash
/dev:gen-tech-spec order-management/create-order   # story → tech spec
/dev:gen-scaffold  order-management/create-order   # tech spec → code scaffold
/dev:review        order-management/create-order   # check impl vs AC
/dev:sync          order-management/create-order   # story updated? see what changed
```

Output: `stories/order-management/create-order/tech/tech-spec.md`

---

### QC — from story to tests

```bash
/qc:gen-test-cases order-management/create-order          # story → test cases
/qc:gen-scripts    order-management/create-order          # test cases → automation scripts
/qc:bug-report     order-management/create-order TC-003   # structured bug report
/qc:sync           order-management/create-order          # story updated? see what changed
```

Output: `stories/order-management/create-order/test/test-cases.md`

---

### Story update flow

```bash
# BA edits ba/order-management/create-order/story.md
/ba:release order-management/create-order v1.1.0
# → auto-diffs vs stories/, summarizes what changed, estimates impact on Dev + QC

/dev:sync order-management/create-order   # AI shows which parts of tech-spec need updating
/qc:sync  order-management/create-order   # AI shows which test cases are now invalid
```

---

## Story folder structure

```
stories/
└── order-management/
    ├── story.md                       ← overview spec
    ├── CHANGELOG.md
    ├── create-order/                  ← sub-spec (one per flow)
    │   ├── story.md                   ← source of truth
    │   ├── CHANGELOG.md
    │   ├── docs/
    │   │   └── release-v1.0.0.md
    │   ├── tech/
    │   │   ├── tech-spec.md           ← Dev output
    │   │   └── .spec-lock             ← which story version this is based on
    │   └── test/
    │       ├── test-cases.md          ← QC output
    │       └── .spec-lock
    └── list-orders/
        └── ...
```

---

## Customize

Two layers, both preserved on `npx specross update`:

**Agents** — change how the AI behaves per role (seniority, tone, rules, red flags):
```
agents/ba.md    agents/dev.md    agents/qc.md
```

**Templates** — change the output format for your team:
```
_templates/story.md        _templates/tech-spec.md
_templates/test-cases.md   _templates/bug-report.md
```

Edit agents to change how the AI *thinks*. Edit templates to change what it *outputs*.

---

## License

MIT
