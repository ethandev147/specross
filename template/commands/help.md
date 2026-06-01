Print the Specross command reference. No arguments needed.

---

Print the following help text exactly:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡  SPECROSS — Spec-driven development (SDD)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BA  ────────────────────────────────────────────────────
  /ba:new-story {story}          Create story, ask clarifying questions
  /ba:review {story}             Check for gaps before releasing
  /ba:impact {story}             Preview Dev/QC impact of pending changes
  /ba:release {story} {version}  Promote to stories/, write release note

DEV ────────────────────────────────────────────────────
  /dev:gen-tech-spec {story}           story → tech-spec + API files + tasks
  /dev:implement {story} {task-id}     Implement a task against the spec
  /dev:review {story}                  Check implementation vs AC
  /dev:sync {story}                    Spec updated? Diff what needs changing
  /dev:done {story}                    Mark complete, write handoff for QC

QC  ────────────────────────────────────────────────────
  /qc:gen-test-cases {story}  story → test cases organized by AC
  /qc:run {story} [TC-ID]     Run TCs interactively — auto bug report on fail, auto-close on retest pass
  /qc:sync {story}            Spec updated? Update affected test cases

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  BA: new-story → review → release
 Dev: gen-tech-spec → implement → review → done
  QC: gen-test-cases → run (retest bằng /qc:run {story} {TC-ID})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
