## Why

When the AI gets stuck during task execution — whether the task description is unclear, contradictory, or the implementation is proving difficult — it has no way to signal this. It either keeps struggling or silently moves on. The user has no visibility into which tasks need their attention. Adding a `needs_help` status gives the AI a structured way to pause, describe the problem, and hand off to the user.

## What Changes

- Add `needs_help` as a new TaskStatus value alongside `ready`, `in_progress`, `committed`, `reviewed`
- The AI sets a task to `needs_help` when it encounters problems it can't resolve on its own:
  - Task description is too vague, contradictory, or doesn't fit with other tasks
  - The AI is struggling with implementation (e.g., can't figure out how to fix a bug)
- When the AI decides it needs help, it:
  - Updates the task's description to explain what's been done and what kind of help is needed
  - Commits any current progress
  - Sets the task's status to `needs_help`
- The task status view displays `needs_help` tasks with a distinct visual indicator
- When the user asks what they need to do, the AI tells them about tasks needing review (`committed`) and tasks needing help (`needs_help`)

## Capabilities

### New Capabilities

_(none — this change modifies existing capabilities)_

### Modified Capabilities

- `task-execution`: Add behavior for when the AI gets stuck — update description, commit progress, set `needs_help` status
- `task-status-view`: Display `needs_help` status with its own color and grouping
- `state-management`: Add `needs_help` to the TaskStatus type and backend mappings

## Impact

- **TypeScript types**: `TaskStatus` type in `taskBackend.ts` gains a new value
- **Beads backend**: New status mapping needed for `needs_help` (likely `open` + label `"needs_help"`)
- **In-memory backend**: Needs to handle the new status value
- **Task view webview**: New color/styling for `needs_help` status, new grouping position
- **Agent prompt / skills**: Execution skill needs instructions for when to set `needs_help` and the required steps (update description, commit, set status)
- **Planning/status skill**: AI needs to surface `needs_help` tasks when user asks what needs attention
