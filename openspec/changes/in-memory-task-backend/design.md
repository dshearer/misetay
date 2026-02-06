## Context

The extension currently hardcodes `BeadsBackend` in `extension.ts` activation. The `TaskBackend` interface is already cleanly abstracted — `BeadsBackend` is the only implementation. The agent skills (planning, execution, review) reference `.beads/issues.jsonl` by name and include it in git commits alongside code changes.

The extension has 7 registered language model tools (4 task management, 3 navigation). Adding `misetay_backendInfo` brings it to 8.

## Goals / Non-Goals

**Goals:**
- Users can try the full plan/execute/review workflow without installing Beads CLI
- Backend selection via VS Code settings (`misetay.taskBackend`)
- Agent skills adapt commit behavior based on backend capabilities
- Zero breaking changes for existing Beads users

**Non-Goals:**
- Persisting in-memory state across sessions (that's what Beads is for)
- Auto-detecting whether Beads is installed and falling back automatically
- Supporting other backends (GitHub Issues, Linear) in this change
- Changing the default backend from Beads

## Decisions

### 1. InMemoryBackend stores tasks in a Map, generates sequential IDs

`InMemoryBackend` holds a `Map<string, Task>` and a counter. Task IDs follow the format `mem-1`, `mem-2`, etc. Dependencies are stored as arrays of ID strings on each task (same as the `Task` interface already defines).

**Why not UUIDs?** Sequential IDs are easier to reference in conversation and match the `bd-xxx` pattern users see with Beads. The `mem-` prefix makes it obvious which backend is active.

**Why not persist to a temp file?** That would add complexity for marginal benefit. The point of in-memory mode is zero-friction trial, not production use.

### 2. VS Code configuration setting in `package.json`

Add a `misetay.taskBackend` setting under `contributes.configuration`:

```json
{
  "misetay.taskBackend": {
    "type": "string",
    "enum": ["beads", "inMemory"],
    "default": "beads",
    "description": "Task backend to use. 'beads' requires Beads CLI installed. 'inMemory' works without any dependencies but tasks are lost when VS Code restarts."
  }
}
```

`extension.ts` reads this at activation and instantiates the appropriate backend. Changing the setting hot-swaps the backend immediately — tools and views use a getter so they always reference the current backend.

**Why not auto-detect Beads?** Explicit configuration is more predictable. Auto-detection adds edge cases (Beads installed but not initialized, Beads on PATH in some terminals but not others). Users should consciously choose.

### 3. `misetay_backendInfo` tool returns backend metadata

A new language model tool registered alongside the existing 7. No input parameters. Returns:

```json
{
  "backend": "inMemory",
  "persistsToFiles": false
}
```

or for Beads:

```json
{
  "backend": "beads",
  "persistsToFiles": true
}
```

This is implemented by adding a `backendInfo()` method to the `TaskBackend` interface:

```typescript
interface BackendInfo {
  name: string;
  persistsToFiles: boolean;
}

interface TaskBackend {
  // ... existing methods ...
  backendInfo(): BackendInfo;
}
```

Each backend returns its own info. The tool handler in `taskTools.ts` just calls `backend.backendInfo()` and returns the result.

**Why a tool instead of embedding info in skill text?** Skills are static markdown files copied to `.github/`. They can't be templated at install time without adding a build step. A tool keeps skills generic and works for any future backend.

**Why not return info from every tool call?** That would change the response schema of existing tools. A dedicated tool is cleaner and only called when the agent needs it.

### 4. Skills use `backendInfo` to conditionally commit state

The three skills are updated with a common pattern. Before any state-commit step, the agent calls `misetay_backendInfo`. If `persistsToFiles` is false, it skips the step.

**Planning skill** — Step 5 ("Commit Planning State"):
- If `persistsToFiles`: `git add -A && git commit -m "Plan feature: <name>"` (existing behavior)
- If not: skip the commit entirely, just confirm tasks were created

**Execution skill** — Step 5 ("Commit Changes and State Together"):
- If `persistsToFiles`: `git add -A` stages both code and `.beads/` state (existing behavior)
- If not: `git add` only the code files, skip staging `.beads/`

**Review skill** — fix commit steps:
- Same pattern as execution: only stage code files when `persistsToFiles` is false

The skill text uses conditional language: "Call `misetay_backendInfo`. If `persistsToFiles` is true, stage all changes including task state files. Otherwise, stage only your code changes."

### 5. Information message on activation with in-memory backend

When `misetay.taskBackend` is `"inMemory"`, show an information message on activation:

> "Misetay is using in-memory task storage. Tasks will be lost when VS Code restarts. Install Beads CLI for persistent task tracking."

Shown once per session, not on every activation. Use `vscode.window.showInformationMessage`.

## Risks / Trade-offs

**[Tasks lost on restart] → Acceptable** — This is by design. The info message makes it clear. Users who need persistence install Beads.

**[Agent may forget to call backendInfo] → Low risk** — The skills explicitly instruct the agent to call it. If it forgets, the worst case is an empty "Plan feature" commit (no `.beads/` files to stage) or a harmless `git add -A` that stages nothing extra.

**[Hot-switching loses in-memory tasks] → Acceptable** — Switching from inMemory to beads (or vice versa) discards any tasks in the old backend. This is inherent and the notification message makes it clear.

**[New method on TaskBackend interface] → Minimal risk** — Adding `backendInfo()` to the interface is additive. `BeadsBackend` gets the method too. No existing code breaks.
