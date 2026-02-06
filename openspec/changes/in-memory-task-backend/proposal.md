## Why

The extension currently requires Beads CLI (`bd`) to be installed before any task management features work. This creates an onboarding cliff — users who discover Misetay can't try the core plan/execute/review workflow without first installing an external dependency. An in-memory task backend lets people experience the full workflow immediately, with zero setup.

## What Changes

- Add a new `InMemoryBackend` class implementing the existing `TaskBackend` interface, storing tasks in extension memory (non-persistent across sessions)
- Introduce a VS Code configuration setting (`misetay.taskBackend`) to choose between `"beads"` (default) and `"inMemory"` backends
- Update extension activation to read the setting and instantiate the chosen backend
- Show an informational message when using in-memory mode, noting that tasks won't persist across sessions
- Add a new `misetay_backendInfo` language model tool that returns backend metadata (e.g., `{ persistsToFiles: true/false }`). The agent calls this to decide whether to include task state in git commits.
- Update agent skills (planning, execution, review) to call `misetay_backendInfo` before state-commit steps, and skip committing `.beads/` state when `persistsToFiles` is false. Currently the skills hardcode committing `.beads/issues.jsonl` alongside code changes and committing planning state — these steps are meaningless without a file-backed backend.

## Capabilities

### New Capabilities
- `in-memory-backend`: In-memory implementation of TaskBackend that requires no external dependencies
- `backend-settings`: VS Code configuration settings for selecting and configuring the task backend

### Modified Capabilities
- `state-management`: Backend selection is now configurable; the default backend remains Beads but can be switched via settings. New `misetay_backendInfo` tool exposes backend metadata so the agent can adapt its behavior.

## Impact

- **Code**: New `inMemoryBackend.ts` file; changes to `extension.ts` activation logic to read settings
- **Settings**: New `misetay.taskBackend` configuration property in `package.json` contributes section
- **Skills**: Planning, execution, and review skills need conditional logic around state-commit steps (committing `.beads/issues.jsonl`, "Plan feature" commits). The agent needs a way to know which backend is active so it can skip file-based state commits in in-memory mode.
- **User experience**: Users without Beads installed get a working (but non-persistent) experience out of the box
- **Existing behavior**: No change for users who already have Beads — it remains the default
