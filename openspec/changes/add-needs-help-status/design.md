## Context

Misatay currently has four task statuses: `ready`, `in_progress`, `committed`, `reviewed`. These model a happy-path workflow where the AI always succeeds. In practice, the AI sometimes gets stuck — a task description is vague, the implementation hits a wall, or the task conflicts with others. Today the AI has no structured way to signal this, so it either keeps struggling or silently moves on. The user has no visibility into blocked work.

The Beads backend maps Misatay statuses to Beads statuses + labels (e.g., `committed` → `closed` + label `"committed"`). The task status view groups tasks by status with color-coded cards. The execution skill defines the task lifecycle loop.

## Goals / Non-Goals

**Goals:**
- Give the AI a way to formally pause and request user help
- Make `needs_help` tasks visible in the task status view
- Ensure the AI commits partial progress before requesting help
- Surface `needs_help` tasks when the user asks what they need to do

**Non-Goals:**
- No sub-categories of help (e.g., "needs-clarification" vs "needs-debugging") — one status is enough for now
- No automated detection of when the AI is stuck — the AI decides when to set this status
- No workflow for the user to "resolve" a `needs_help` task back to `ready` through UI — the user talks to the AI and the AI updates the task

## Decisions

### 1. `needs_help` maps to Beads `open` + label `"needs_help"`

The task needs user attention, so it shouldn't be `closed` or `in_progress`. Using `open` with a distinguishing label follows the same pattern as `committed`/`reviewed` (which use `closed` + label). The `fromBeadsStatus` mapping checks for the `needs_help` label on `open` tasks before defaulting to `ready`.

Alternative considered: Using Beads `blocked` status. Rejected because `blocked` in Beads implies waiting on a dependency, not waiting on human input.

### 2. Display order: `needs_help` appears first in the task view

The `statusOrder` array in `taskStatusView.ts` becomes `['needs_help', 'in_progress', 'ready', 'committed', 'reviewed']`. Tasks needing help are the highest priority for user attention, so they appear at the top.

Color: orange/red (`--vscode-charts-orange`) to signal urgency without being alarming.

### 3. AI updates description before setting `needs_help`

When the AI decides it needs help, the execution skill instructs it to:
1. Update the task description to append what was done and what help is needed
2. Commit any work in progress (partial implementation is better than lost work)
3. Set status to `needs_help`

This ensures the user has context when they see the task. The description update uses the existing `updateTask` tool — no new tools needed.

### 4. Agent prompt surfaces `needs_help` alongside `committed` in "what to do" responses

When the user asks "what do I need to do?" or similar, the agent mentions:
- Tasks with status `committed` (ready for review)
- Tasks with status `needs_help` (need user attention)

This is a prompt/skill change, not a code change.

### 5. A dedicated "Needs Help" skill guides the user through resolving `needs_help` tasks

Rather than inlining help-resolution logic into the execution or review skills, a new `skills/needs-help/SKILL.md` skill handles the workflow when the user decides to work on a `needs_help` task. This follows the same pattern as Planning, Execution, and Review — each workflow phase gets its own skill.

The skill's flow:
1. Read the task description to understand what help is needed
2. Present the problem to the user with context
3. Collaborate with the user to resolve the issue (clarify requirements, debug together, etc.)
4. Once resolved, set the task back to `ready` or `in_progress` and continue execution

The agent prompt routes to this skill when `needs_help` tasks exist and the user wants to address them.

## Risks / Trade-offs

- **AI overuses `needs_help`**: If the AI sets this too eagerly, users get interrupted frequently. Mitigation: The execution skill prompt frames this as a last resort after genuine effort.
- **Partial commits may not build**: The AI commits progress before setting `needs_help`, but that partial work may leave the codebase in a broken state. Mitigation: This is acceptable — the user will work with the AI to resolve it, and fix commits follow.
- **Description gets long with appended help context**: Multiple rounds of help could bloat the description. Mitigation: The AI should replace (not append to) the help context on subsequent `needs_help` transitions.
