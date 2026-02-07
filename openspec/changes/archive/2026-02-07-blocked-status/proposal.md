## Why

So the project status is clear to the user. Today, tasks with unmet dependencies show as "ready" even though they can't be worked on yet. This makes it hard to see at a glance what's actually actionable versus what's waiting on other work.

## What Changes

- Add a `blocked` status to the task system, representing tasks that depend on incomplete tasks
- Display blocked tasks in the Task View with distinct styling, grouped separately from ready tasks
- When the AI finishes a task (marks it `committed`), automatically check if any blocked tasks now have all dependencies met, and transition them to `ready`
- Prevent the AI from starting work on blocked tasks

## Capabilities

### New Capabilities

_None — this change modifies existing capabilities._

### Modified Capabilities

- `state-management`: Add `blocked` to `TaskStatus` type; add logic to compute and transition blocked/ready based on dependency state
- `task-status-view`: Display blocked tasks with distinct styling and grouping
- `task-execution`: After completing a task, check for and unblock dependent tasks; refuse to start blocked tasks

## Impact

- `src/taskBackend.ts` — `TaskStatus` type union
- `src/inMemoryBackend.ts` — status transition logic on task updates
- `src/beadsBackend.ts` — map Beads `blocked` status correctly instead of collapsing to `ready`
- `src/taskStatusView.ts` — rendering and grouping for blocked status
- `webview/taskCard.html` / `webview/taskStatus.html` — styling for blocked cards
- `src/taskTools.ts` — tool descriptions updated to document blocked status behavior
- Specs: `state-management`, `task-status-view`, `task-execution`
