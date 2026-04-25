> **Agent:** Read `.claude/agents/qc.md` and adopt that persona fully before proceeding.

---

Generate test cases for story: $ARGUMENTS

## Steps

1. Read `stories/$ARGUMENTS/story.md` fully. If it doesn't exist, stop and say:
   "Story not found. Run `/ba:new-story $ARGUMENTS` first."

2. Check that the story has complete Acceptance Criteria. If incomplete, warn the user.

   Also check if `stories/$ARGUMENTS/tech/handoff.md` exists — if so, read it for:
   - Known limitations / assumptions QC should be aware of
   - How to test locally (env setup, seed data)
   Include any relevant notes as comments in the generated test cases.

3. Read `CLAUDE.md` for testing conventions, framework, and naming standards.

4. Read `_templates/test-cases.md` — format for the **index file**.
   Read `_templates/test-case-file.md` — format for **each cases/ file**.

5. Check if `stories/$ARGUMENTS/test/` already has files. If so, warn and ask to confirm before overwriting.

---

### Output structure to generate

```
stories/$ARGUMENTS/test/
├── test-cases.md              ← index: summary, run log, coverage matrix, bug report table
├── cases/
│   ├── AC-01-{slug}.md        ← all TCs covering AC-01
│   ├── AC-02-{slug}.md        ← all TCs covering AC-02
│   ├── EC-01-{slug}.md        ← edge cases from story
│   └── ...
└── .spec-lock
```

**Rules for `cases/` filenames:**
- One file per AC and per distinct edge case group
- Filename: `{AC-or-EC-id}-{short-slug}.md`
  - e.g. `AC-01-create-order-success.md`, `EC-01-duplicate-order.md`
- TCs are numbered globally (no reuse across files):
  - AC-01 → TC-001 to TC-009
  - AC-02 → TC-010 to TC-019
  - AC-03 → TC-020 to TC-029
  - EC-xx → TC-100+

---

### 6. Generate each `test/cases/{AC-id}-{slug}.md`

Follow `_templates/test-case-file.md` exactly.
- Each file covers one AC (or EC group)
- Minimum: 1 happy path + 1 negative TC per AC
- Every edge case from story.md for that AC gets its own TC
- Every TC starts with `Result: ⏳ Pending` and `Run date: —`
- Fill `{{AC_ID}}`, `{{AC_TITLE}}`, `{{STORY_SLUG}}`, `{{DATE}}`

---

### 7. Generate `test/test-cases.md` (index file)

Follow `_templates/test-cases.md` exactly.
- **Summary table:** total TCs, all start as ⏳ Pending
- **Coverage Matrix:** one row per AC/EC, link to its cases/ file
- **Test Run Log:** one row per TC across all files — TC ID, title, type, AC, result (⏳), run date (—)
- **Bug Reports table:** empty initially (`—`)
- Fill `{{STORY_NAME}}`, `{{STORY_SLUG}}`, `{{DATE}}`

---

### 8. Write `.spec-lock`

Read `stories/$ARGUMENTS/CHANGELOG.md` for the current story version. Write `stories/$ARGUMENTS/test/.spec-lock`:

```
story: $ARGUMENTS
spec-version: {current-story-version}
generated: {today}
```

---

### 9. Print summary

```
Test cases generated for: $ARGUMENTS

  stories/$ARGUMENTS/test/test-cases.md        ← index + run log
  stories/$ARGUMENTS/test/cases/AC-01-....md
  stories/$ARGUMENTS/test/cases/AC-02-....md
  ...
  stories/$ARGUMENTS/test/.spec-lock

Total: {N} TCs across {M} files
  Happy path: {N}   Edge case: {N}   Negative: {N}

⚠️  Gaps: {list any ACs with incomplete coverage, or "None"}

Next: /qc:gen-scripts $ARGUMENTS to generate automation scripts
     Update result in test-cases.md as you run each TC
     /qc:bug-report $ARGUMENTS {TC-ID} when a TC fails
```
