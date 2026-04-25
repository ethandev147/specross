> **Agent:** Read `.claude/agents/ba.md` and adopt that persona fully before proceeding.

---

Create a new story or sub-spec for: $ARGUMENTS

`$ARGUMENTS` supports two formats:
- `{slug}` — standalone story, e.g. `user-authentication`
- `{parent}/{slug}` — sub-spec under a parent, e.g. `order-management/create-order`

## Steps

1. Parse $ARGUMENTS:
   - If it contains `/`: IS_SUB_SPEC = true, PARENT = part before `/`, SLUG = part after `/`
   - If no `/`: IS_SUB_SPEC = false, SLUG = $ARGUMENTS

2. Determine the display name (title-case the slug, e.g. `create-order` → "Create Order").

3. Create the following folder and files at `ba/$ARGUMENTS/`:

```
ba/$ARGUMENTS/
├── story.md        ← populate from _templates/story.md
├── CHANGELOG.md    ← create with initial entry
└── docs/           ← empty folder (add a .gitkeep)
```

4. In `ba/$ARGUMENTS/story.md`, copy the contents of `_templates/story.md` exactly and replace:
   - `{{STORY_NAME}}` with the display name
   - `{{STORY_SLUG}}` with `$ARGUMENTS`
   - `{{DATE}}` with today's date in YYYY-MM-DD format

   **If IS_SUB_SPEC = true**, also add this line to the header table in story.md:
   ```
   | **Parent spec** | `ba/{PARENT}/story.md` |
   ```

   **If IS_SUB_SPEC = false**, replace the Sub-specs section in story.md with:
   ```markdown
   ## Sub-specs

   > List child specs here as this feature is broken down.

   | Spec | Status | Notes |
   |------|--------|-------|
   | | | |
   ```

5. In `ba/$ARGUMENTS/CHANGELOG.md`, create:

```markdown
# Changelog — {display name}

## v0.1.0 — {today}
- Initial spec created
```

6. **If IS_SUB_SPEC = true**, check if `ba/{PARENT}/story.md` exists. If it does, append a row to its Sub-specs table:
   ```
   | [{display name}]({SLUG}/story.md) | Draft | |
   ```
   If the parent story doesn't have a Sub-specs table yet, add the section at the end.

7. Print a summary:
   - List the files created
   - If sub-spec: remind BA to fill in AC specific to this flow/area
   - If parent: remind BA to fill in the overview, then create sub-specs with `/ba:new-story {SLUG}/{sub-slug}`

8. **Ask open questions to help the BA clarify the story** before they start writing.

   Based on the story name and slug, generate 4–7 targeted questions that expose common gaps.
   Cover these angles (pick the most relevant, don't ask all mechanically):

   - **Who:** Which user roles are involved? Are there permission differences between them?
   - **Trigger:** What exactly triggers this flow? (user action, system event, scheduled job?)
   - **Happy path:** What does success look like — what does the user see/get?
   - **Failure states:** What can go wrong? What should happen when it does?
   - **Edge cases:** Any boundary conditions? (empty states, duplicates, limits, concurrency?)
   - **Data:** What data is created/modified/deleted? Any validation rules?
   - **Dependencies:** Does this depend on another story, service, or external system?
   - **Out of scope:** Anything that sounds related but should NOT be in this story?

   Format:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📋  Open questions for: {display name}
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Answer these to fill in your story.md clearly:

   1. [Question]
   2. [Question]
   3. [Question]
   ...

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Once answered, fill in story.md then run /ba:review $ARGUMENTS
   ```

   Wait for the BA to answer. Once they respond, offer to fill in the relevant sections of `ba/$ARGUMENTS/story.md` based on their answers.
