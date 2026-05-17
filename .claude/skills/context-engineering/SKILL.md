---
name: context-engineering
description: "Plan and implement non-trivial features using the PRP (Product Requirements Prompt) workflow — a context-engineering methodology that front-loads research, codebase analysis, documentation links, gotchas, and executable validation gates into a single document before any code is written. This skill should be used when the user describes a feature that touches multiple files, integrates a new library/API, requires a multi-step plan, or says things like 'plan this out first', 'do it properly', 'big feature', 'research before coding', 'write a spec', 'INITIAL.md', 'PRP', 'generate-prp', 'execute-prp', 'context engineering', or 'one-pass implementation'. Do NOT use for one-line fixes, typos, or rename refactors — overhead is not worth it."
metadata:
  version: 1.0.0
  source: https://github.com/coleam00/context-engineering-intro
---

# Context Engineering — PRP Workflow

The PRP (Product Requirements Prompt) workflow is a discipline for shipping
non-trivial features with AI assistance in roughly one pass, by gathering all
relevant context BEFORE writing code. The premise: most agent failures aren't
model failures, they're context failures.

The workflow has three phases:

1. **Initial brief** — user describes what they want in an `INITIAL.md`-style note.
2. **Generate PRP** — Claude researches the codebase + external docs and writes a
   self-contained implementation plan (`PRPs/<feature>.md`) with validation gates.
3. **Execute PRP** — Claude implements the plan, runs validation, iterates until
   tests pass.

## When this skill should fire

Use it whenever the task is bigger than a one-shot edit:

- Adding a new feature that touches 3+ files or a new dependency.
- Integrating an external API or library Claude isn't fluent in.
- A refactor where convention-matching matters.
- The user explicitly says "plan first", "write a PRP", "ultrathink before
  coding", or mentions context engineering / generate-prp / execute-prp.

Skip it for: typos, one-line bug fixes, formatting, simple renames. The setup
overhead isn't worth it.

## Phase 1 — Capture the initial brief

If the user hasn't already written one, ask them to draft an `INITIAL.md` with
four sections (or draft it yourself from the conversation and have them confirm):

```markdown
## FEATURE
[What's being built — be concrete. End-state behavior, not implementation.]

## EXAMPLES
[Paths in this repo with patterns to mirror, or external URLs.
Skim them and note what to copy and what to ignore.]

## DOCUMENTATION
[Library docs, API references, blog posts. Pin specific section anchors.]

## OTHER CONSIDERATIONS
[Gotchas, auth requirements, env vars, perf constraints, things Claude
typically misses.]
```

A worked sample lives at `references/initial-example.md` — read it before
drafting the user's INITIAL if you're unsure what level of detail to ask for.

## Phase 2 — Generate the PRP

Given the INITIAL brief, produce `PRPs/<feature-name>.md` using the template at
`references/prp-base-template.md`. Read that template before writing — it has
sections you must not omit.

### Research checklist before writing the PRP

1. **Codebase analysis**
   - Grep / glob for similar features. Use Explore agent for non-trivial scope.
   - Identify the files Claude will need to read or modify — list them in PRP.
   - Note existing conventions (naming, error handling, test layout) so the
     implementation matches.
   - Find the test pattern used in this repo so validation gates match.

2. **External research**
   - Pull the library docs URLs the feature will need; pin SECTION anchors,
     not just root URLs.
   - Look up known gotchas / version mismatches / breaking changes.
   - Find a real working example (GitHub, blog, official sample).

3. **Clarify with the user** only if a question would change the architecture
   (auth model, sync vs async, single-tenant vs multi). Don't ask trivia.

### What the PRP must include

Copy the structure from `references/prp-base-template.md`. The non-negotiable
sections:

- **Goal / Why / What** with concrete success criteria (checkboxes).
- **All Needed Context** — every URL, every file path, every gotcha. Assume the
  agent executing the PRP has nothing but training data + this document +
  the codebase. If it isn't in the PRP, it doesn't exist.
- **Known gotchas / library quirks** — explicit warnings about traps.
- **Implementation blueprint** — pseudocode + ordered task list. Specific
  file paths and function names, not vague verbs.
- **Validation gates** — copy/pasteable shell commands the agent will run.
  Match the project's actual tooling. Examples:

  ```bash
  # Python
  ruff check --fix && mypy .
  uv run pytest tests/ -v

  # Node/TS
  npm run lint && npm run typecheck
  npm test -- --run

  # Go
  go vet ./... && go test ./...
  ```

  If the project has no tests, propose adding one — don't skip the gate.

### Before saving the PRP — ULTRATHINK

Spend extra thinking budget reviewing: does the PRP have enough context that
a fresh Claude session, with zero history, could implement this correctly?
Walk the implementation in your head. If you'd get stuck somewhere, add
context there.

End the PRP with a self-assessed **confidence score (1–10)** for one-pass
implementation success. Below 7, list what's still ambiguous.

Save to: `PRPs/<feature-name>.md`.

## Phase 3 — Execute the PRP

When asked to implement a PRP (or you've just written one and the user
approves it):

1. **Load the PRP** end-to-end. Re-fetch any URLs and re-read referenced files.
2. **ULTRATHINK** the plan. Use TodoWrite to enumerate the ordered task list
   from the blueprint. One todo per concrete step.
3. **Execute** in order. Match repo conventions you noted during research.
4. **Validate** — run every command from the validation gates section. On
   failure, diagnose root cause, fix, re-run. Don't disable tests to make
   them pass.
5. **Re-read the PRP** one final time and verify every success-criteria
   checkbox is actually met. Mark each done in your reply.

If validation keeps failing after 2–3 fix attempts, stop and surface the
blocker to the user rather than thrashing.

## Anti-patterns to avoid

- Generating a PRP without grepping the codebase — you'll miss conventions.
- Pasting whole library docs into the PRP instead of pinning the relevant
  sections — bloats context for the executor.
- Skipping the validation gates "because it's a small feature." If it's
  small, you didn't need a PRP.
- Treating ULTRATHINK as a magic word. It means: actually spend reasoning
  budget reviewing the plan before committing.
- Writing PRPs in the chat rather than to `PRPs/<feature>.md`. The file is
  the contract; conversation gets lost.

## Optional slash-command form

If the user prefers explicit invocation, the upstream repo defines two slash
commands:

- `/generate-prp INITIAL.md` — run Phase 1→2.
- `/execute-prp PRPs/feature.md` — run Phase 3.

These aren't installed in this repo by default. To add them, copy
`generate-prp.md` and `execute-prp.md` into `.claude/commands/`. Either way,
this skill carries the same workflow.

## References bundled with this skill

- `references/prp-base-template.md` — the PRP structure to follow.
- `references/initial-example.md` — a fully-filled INITIAL.md for inspiration.

## Source

https://github.com/coleam00/context-engineering-intro
