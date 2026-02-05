## Overview

Smidja is a thin orchestration layer on top of existing tools:
- GitHub Copilot (for AI code generation)
- VS Code extension (for task management and review navigation)

The core intelligence lives in a Copilot agent definition (`.github/agents/smidja.agent.md`) with modular skills for each workflow phase.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  SMIDJA COMPONENTS                                      │
└─────────────────────────────────────────────────────────┘

1. Copilot Agent (.github/agents/smidja.agent.md)
   ├─ Uses built-in tools:
   │   - edit (make code changes)
   │   - read (understand existing code)
   │   - search (find files)
   │   - todo (track progress in-session)
   │   - shell (git commands)
   │
   └─ Uses custom tools:
       Navigation (Smidja-specific):
       - dshearer.smidja/openFile
       - dshearer.smidja/highlightLines
       - dshearer.smidja/navigateToLine
       
       Task Management (Smidja-specific):
       - dshearer.smidja/createTask
       - dshearer.smidja/updateTask
       - dshearer.smidja/listTasks
       - dshearer.smidja/addDependency

2. Agent Skills (.github/skills/)
   ├─ planning/SKILL.md      - Planning dialogue workflow
   ├─ execution/SKILL.md     - Task implementation workflow
   ├─ review/SKILL.md        - Code review workflow
   
   Skills are loaded on-demand by Copilot based on description matching

3. VS Code Extension (src/)
   └─ Task management tools only:
       - createTask(title, description, status?)
       - updateTask(id, updates)
       - listTasks(status?, branch?)
       - addDependency(childId, parentId)
   
   Navigation tools for code review:
       - openFile(filePath, line?)
       - highlightLines(startLine, endLine)
       - navigateToLine(line)

4. Task Backend (pluggable)
   - Default: Beads (.beads/issues.jsonl)
   - Alternative: GitHub Issues, Linear, JIRA, etc.
   - Stores: id, title, description, status, branch, dependencies
   - Git-backed preferred for persistence and collaboration
```

## Initial Setup

Before using Smidja, users must:

1. Install the Smidja extension from VS Code marketplace
2. Install task backend (e.g., `brew install beads` for default)
3. Run command: "Smidja: Install Agent"
   - Copies agent definition to `.github/agents/smidja.agent.md`
   - Copies skill files to `.github/skills/`
   - One command installs everything needed

After installation, chat with the Smidja custom agent.

## Workflow Phases

### 1. Planning

```
User: "Add dark mode"

Smidja (planning skill):
  - Engages in dialogue to understand requirements
  - Proposes task breakdown
  - Gets human approval
  - Creates tasks using custom tools:
    
    createTask("Add theme context", "Create ThemeContext...", "ready")
    → Returns: bd-abc1
    
    createTask("Add color palette", "Define colors...", "ready")
    → Returns: bd-abc2
    
    createTask("Update components", "Apply theme to...", "ready")
    → Returns: bd-abc3
    
    addDependency(bd-abc2, bd-abc1)
    addDependency(bd-abc3, bd-abc2)
  
Result: Tasks in backend with dependency graph
```

### 2. Execution

```
Smidja (execution skill):
  - Creates feature branch
  - Processes tasks sequentially (respects deps)
  - For each task:
    1. Update status: updateTask(bd-abc1, {status: "in_progress"})
    2. Use edit tool to make changes
    3. Commit: git commit -m "Add theme context (bd-abc1)"
    4. Update status: updateTask(bd-abc1, {status: "committed"})
    5. Notify human: "Task bd-abc1 complete. Ready to review?"
    6. Wait for human response:
       - If "yes" → enter review flow
       - If "no" or "later" → move to next task

Result: Linear commit history, all tasks committed
```

### 3. Review (async, human-driven)

```
User: "Review bd-abc1"

Smidja (review skill):
  - Finds commits: git log --grep="bd-abc1"
  - Gets affected files: git log --grep="bd-abc1" --name-only
  - Opens files at current HEAD (not diff view)
  - Uses navigation tools to highlight relevant sections
  - Explains what was done in chat

If approved:
  updateTask(bd-abc1, {status: "reviewed"})

If changes requested:
  - Update status: updateTask(bd-abc1, {status: "in_progress"})
  - Make changes with edit tool
  - Append commit: git commit -m "Fix theme default (bd-abc1)"
  - Update status: updateTask(bd-abc1, {status: "committed"})
  - Offer to review again

Result: Tasks marked reviewed, fixup commits appended
```

## Key Decisions

### Decision 1: Copilot Agent (not Extension UI)

**Choice**: Implement as GitHub Copilot custom agent

**Rationale**:
- Copilot provides LLM intelligence, code understanding, and edit capabilities
- Agent can use existing Copilot tools (edit, read, search)
- Extension provides task management and navigation tools
- Simpler than building custom chat UI or LLM integration

**Tradeoff**: Requires GitHub Copilot subscription

### Decision 2: Task Management Abstraction

**Choice**: Provide custom tools for task operations, not direct CLI calls

**Rationale**:
- **Pluggable**: Users can choose backend (Beads, Linear, GitHub Issues, etc.)
- **Consistent**: Agent uses same tools regardless of backend
- **Validated**: Tools can enforce constraints and validate inputs
- **Flexible**: Can add features without changing agent prompt

**Default Implementation**: Beads
- Git-backed: state persists, can be versioned
- Dependency tracking built-in
- Agent-friendly JSON output
- Works across chat sessions
- Can be used by humans and AI

**Alternative backends**:
- GitHub Issues API
- Linear API
- JIRA API
- Custom JSON files
- SQLite database

**Tools provided**:
- `createTask(title, description, status)` → returns task ID
- `updateTask(id, {status?, description?, ...})` → success/error
- `listTasks({status?, branch?})` → array of tasks
- `addDependency(childId, parentId)` → success/error

### Decision 3: Linear Commits, No Rebasing

**Choice**: Append fixup commits instead of rewriting history

**Rationale**:
- **Simpler**: No interactive rebase complexity
- **Safer**: No merge conflicts from rewriting history
- **Realistic**: Mirrors actual human workflow
- Can squash manually later if desired

**Flow**:
```
Initial commits:
  - Add theme context (bd-abc1)
  - Add color palette (bd-abc2)
  - Update components (bd-abc3)

Review feedback on bd-abc1:
  - Fix theme default (bd-abc1)

Final history: 4 commits, chronological order
```

**Alternative considered**: Interactive rebase to amend commits
- Risk: Merge conflicts with later commits
- Complexity: AI must handle conflict resolution
- Benefit: Cleaner history
- Verdict: Not worth the risk and complexity

### Decision 4: Review Current State, Not Diffs

**Choice**: When reviewing a task, show files at current HEAD

**Rationale**:
- **Simpler**: Just open the files as they exist now
- **Realistic**: See how the task integrates with other work
- **Natural**: Matches how you'd manually check code

**Consideration**: Files may include changes from later tasks
- This is okay - you're reviewing "did this task do what it should?"
- Current state shows how it fits with everything else

**Alternative considered**: Show git diff of task commits
- More isolated view of just that task's changes
- But loses context of integration
- Adds complexity to generate and display diffs

### Decision 5: No Worktrees, Sequential Execution

**Choice**: Execute tasks sequentially on one branch

**Rationale**:
- Don't need parallel execution
- Simpler git management
- Natural review flow (review whenever, doesn't block)
- Pair programming feel: work together in same workspace

**Initial consideration**: Worktrees for parallel execution
- Seemed necessary to work on task-2 while reviewing task-1
- But async review (with append commits) eliminates this need
- Worktrees add complexity without benefit

### Decision 6: Agent Skills for Modularity

**Choice**: Break workflow into modular Agent Skills

**Rationale**:
- Each workflow phase (planning, execution, review) has distinct behavior
- Skills are loaded on-demand (only when description matches)
- Keeps prompts focused and maintainable
- Can update one phase without affecting others
- Skills are portable across VS Code, Copilot CLI, and coding agent

**Structure**:
```
.github/skills/
├── planning/
│   └── SKILL.md (name: planning, description: task breakdown workflow)
├── execution/
│   └── SKILL.md (name: execution, description: implement tasks sequentially)
├── review/
│   └── SKILL.md (name: review, description: review code changes)
```

Main agent defines overall role and available tools. Skills provide detailed
instructions for each workflow phase. Copilot automatically loads relevant
skills based on the user's request.

## Data Flow

### Task Lifecycle

```
┌─────────┐
│  ready  │ ← createTask(..., status: "ready")
└────┬────┘
     │
     ↓
┌─────────────┐
│ in_progress │ ← updateTask(id, {status: "in_progress"})
└──────┬──────┘
       │
       ↓
┌───────────┐
│ committed │ ← updateTask(id, {status: "committed"})
└─────┬─────┘
      │
      ├──→ (approved) ──→ ┌──────────┐
      │                   │ reviewed │ ← updateTask(id, {status: "reviewed"})
      │                   └──────────┘
      │
      └──→ (changes) ──→ ┌─────────────┐
                          │ in_progress │ (back to fix)
                          └─────────────┘
```

### Reference Flow

```
Tasks (created first via createTask):
  bd-abc1: "Add theme context"
  bd-abc2: "Add color palette"
  ├─ depends on bd-abc1 (via addDependency)

Git Commits (reference task IDs):
  a1b2c3d: "Add theme context (bd-abc1)"
  d4e5f6g: "Add color palette (bd-abc2)"
  h7i8j9k: "Fix theme default (bd-abc1)"

Finding commits for review:
  git log --grep="bd-abc1"
  → Returns: a1b2c3d, h7i8j9k

One-way reference: commits → task IDs
Backend stores task metadata
```

## Dependencies

### Required Extensions
- GitHub Copilot (subscription required)

### Required Tools
- Task backend (default: Beads CLI via `brew install beads` or npm/go)

### Extension Dependencies
- VS Code extension API
- TypeScript toolchain
- Minimal additional dependencies (task backend adapters only)

### Task Backend Options
1. **Beads** (default): Git-backed, local-first, dependency tracking
2. **GitHub Issues**: Requires GH token, web-based
3. **Linear**: Requires API key, web-based
4. **Custom**: Implement task tool interface

## Open Questions

1. **PR creation flow**: Holding off for now, but will need to design GitHub PR integration
2. **CI error handling**: Polling CI status and helping fix errors - not yet designed
3. **Error recovery**: How does agent handle failures (edit tool errors, git conflicts, etc.)?
4. **Multi-project support**: Can one agent work on multiple projects simultaneously?
5. **Handoffs**: Consider using agent handoffs (Planning → Execution → Review) for guided workflows with pre-filled prompts
