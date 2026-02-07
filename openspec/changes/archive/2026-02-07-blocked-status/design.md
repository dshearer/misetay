## Context

Tasks have four statuses today: `ready`, `in_progress`, `committed`, `reviewed`. Dependencies exist (via `addDependency`) but don't affect status — a task with unmet dependencies still shows as `ready`, making it unclear what's actually actionable.

The Beads CLI already has a native `blocked` status, but BeadsBackend currently maps it to `ready` (line 77 of `beadsBackend.ts`), discarding the information.

## Goals / Non-Goals

**Goals:**
- A task with unmet dependencies shows as `blocked`, not `ready`
- Blocked tasks transition to `ready` automatically when their dependencies complete
- The Task View shows blocked tasks with distinct styling
- The AI cannot start work on a blocked task

**Non-Goals:**
- Manual blocking/unblocking (only dependency-driven)
- Circular dependency detection
- Blocking reasons beyond "dependency not done"

## Decisions

### 1. `blocked` is a stored status, not computed at read-time

Add `'blocked'` to the `TaskStatus` union. Tasks are explicitly set to `blocked` or `ready` — the system doesn't recompute status on every `listTasks` call.

**Why over computed:** Both backends already store status explicitly. BeadsBackend delegates to Beads CLI which has a native `blocked` status. Stored status is simpler to render, filter, and reason about. Computed status would require fetching all dependency chains on every read.

### 2. Auto-transition logic lives in each backend

Each backend handles blocked/ready transitions in its own `addDependency` and `updateTask` methods rather than in a shared middleware layer.

**Why over shared layer:** No shared middleware layer exists today — the `TaskBackend` interface is implemented directly. BeadsBackend can lean on Beads CLI's native `blocked` status. InMemoryBackend is simple enough to implement inline. Adding a wrapper would be a larger refactor for minimal gain.

### 3. Transition trigger points

Two triggers manage the blocked ↔ ready transitions:

- **`addDependency(childId, parentId)`**: After adding the dependency, if the parent is not yet `committed` or `reviewed`, set the child to `blocked` (if it was `ready`).
- **`updateTask(id, {status: 'committed'})` or `{status: 'reviewed'}`**: After updating, find all tasks that depend on this task. For each, check if *all* their dependencies are now `committed` or `reviewed`. If so, transition from `blocked` to `ready`.

A dependency is "met" when its parent task status is `committed` or `reviewed`.

### 4. Guard against starting blocked tasks

The `updateTask` tool rejects transitions from `blocked` to `in_progress`. The AI must respect this. The tool returns an error message explaining the task is blocked.

### 5. Task View display order and styling

Blocked tasks appear in their own section, after ready and before committed:

`in_progress` → `ready` → `blocked` → `committed` → `reviewed`

Blocked cards use `--vscode-charts-orange` for the border and status badge — distinct from ready (blue) but clearly "not done." The existing dependency tags on blocked cards already show what they're waiting on.

## Risks / Trade-offs

**[Race condition on concurrent updates]** → Acceptable for now. Both backends are single-user (VS Code extension). Beads CLI handles file-level concurrency.

**[BeadsBackend: Beads CLI may auto-manage blocked status]** → If Beads CLI sets `blocked` natively on `dep add`, our explicit status set may conflict. Mitigation: test Beads CLI behavior and conditionally skip our own status update if Beads handles it.

**[Tasks created with dependencies already blocked]** → `createTask` doesn't accept dependencies today; they're added separately via `addDependency`. So the transition in `addDependency` is sufficient.
