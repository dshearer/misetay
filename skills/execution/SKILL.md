---
name: misatay-execution
description: Systematic task implementation with proper commits and status tracking
---

# Execution Skill

This skill guides you through implementing tasks one at a time with proper git commits and status tracking.

## When to Use This Skill

Use this skill when:
- Tasks have been created and are ready to implement
- User asks to "start working" or "implement the tasks"
- Resuming work on an in-progress task
- User says something like "Let's start", "Begin implementation", "Work on task X"

## Before Starting

1. **List tasks** - Use `dshearer.misatay/listTasks` to see what needs to be done
2. **Identify next task** - Find tasks with status "ready" (all dependencies satisfied)

**IMPORTANT**: The git repo should not have uncommited changes. If it does, STOP and ask the user what to do.

## Task Execution Loop

For each task, follow this workflow:

### Step 1: Verify Dependencies

Before starting a task, verify all dependencies are complete:

```
Use dshearer.misatay/listTasks to get all tasks
Check that all parent tasks (dependencies) of the current task have status "committed" or "reviewed"
If dependencies are not complete, skip this task and find another ready task
```

**Never start a task if its dependencies are incomplete.**

### Step 2: Mark Task In Progress

When you begin working on a task:

```
Use dshearer.misatay/updateTask:
- taskId: the task ID
- updates: { status: "in_progress" }
```

This signals to the user (and the task status view) that you're actively working on this task.

### Step 3: Implement Changes

Make the code changes needed for this task:

- **Use the edit tool** to modify files (not shell commands)
- Make focused changes that match the task description
- Follow existing code patterns and style
- Add/update tests if appropriate
- Update documentation if needed

**Keep changes focused on this task only.** Don't mix concerns or implement multiple tasks at once.

### Step 4: Mark Task Committed

Once implementation is complete, update the task status BEFORE committing:

```
Use dshearer.misatay/updateTask:
- taskId: the task ID
- updates: { status: "committed" }
```

This marks the task as complete in the backend.

### Step 5: Commit Changes and State Together

Call `dshearer.misatay/backendInfo`. If `persistsToFiles` is true, stage all changes (code + task state files). If `persistsToFiles` is false, stage only your code changes (not `.beads/`).

```bash
# If persistsToFiles is true:
git add -A

# If persistsToFiles is false:
# Stage only specific code files you changed (not .beads/)
git add <file1> <file2> ...

# Commit with task ID in message
git commit -m "Task description (task-id)"
```

**Commit Message Format**: `"Task description (task-id)"`

Examples:
- `"Add ThemeContext provider (bd-abc1)"`
- `"Update Button component to use theme colors (bd-abc3)"`
- `"Add user authentication API integration (bd-xyz7)"`

**Critical**:
- Always update status to "committed" BEFORE running git commit
- Always include the task ID in parentheses at the end
- This enables finding commits later with `git log --grep="task-id"`

### Step 6: Notify User

After marking the task committed, notify the user:

```
"✅ Task <task-id> complete: <task title>

Commit: <commit-hash>

Ready to review? Or should I continue with the next task?"
```

**Wait for user response**:
- If user says "yes", "review", "show me" → Switch to Review Skill
- If user says "no", "later", "continue", "next" → Loop back to Step 1 for next task
- If unsure, ask for clarification

### Step 7: Move to Next Task

If user wants to continue (not review), loop back to Step 1:

1. Check task list again with `dshearer.misatay/listTasks`
2. Find the next task with status "ready"
3. Verify its dependencies
4. Start the loop again

**Continue until**:
- All tasks are committed
- User asks to stop
- User asks to review

## Branch Management

**Work on current branch**: Commit to whatever branch is currently checked out. Do NOT create new branches during execution.

If user asks about branches or if you're on main/master:
- Suggest they create a feature branch first: `git checkout -b feature/<name>`
- Wait for them to create it before starting execution
- Then proceed with task execution on their new branch

## Important Principles

### One Task at a Time
- Complete one full task before moving to the next
- Don't mix changes from multiple tasks in one commit
- Each commit should map to exactly one task

### Respect Dependencies
- Always check dependencies before starting a task
- Skip tasks with incomplete dependencies
- Come back to them after their parents are done

### Linear Commits
- Never amend or rebase commits
- Always append new commits
- If mistakes are made, create fix commits (handled in Review Skill)

### Status Tracking
- Always update status to "in_progress" when starting
- Always update status to "committed" after committing
- This keeps the task status view accurate

### Task ID Traceability
- Always include task ID in commit message
- Format: "Description (task-id)"
- Enables `git log --grep="task-id"` to find all commits for a task

## Example Execution Flow

```
User: "Start implementing the tasks"

You: [Check tasks with listTasks()]
"I see 5 tasks. Task bd-abc1 'Add ThemeContext provider' is ready. Starting now."

[Update status to in_progress]
[Use edit tool to create ThemeContext.tsx]
[Use edit tool to add provider to App.tsx]

"Changes complete. Committing..."

[Update status to committed]
[Run: git add -A]
[Run: git commit -m "Add ThemeContext provider (bd-abc1)"]

"✅ Task bd-abc1 complete: Add ThemeContext provider

Commit: a3f8d2c

Ready to review? Or should I continue with task bd-abc2 (Create color palette)?"

User: "Continue"

You: [Check tasks with listTasks()]
"Task bd-abc2 depends on bd-abc1, which is committed. Starting bd-abc2..."

[Repeat loop...]
```

## Handling Edge Cases

### What if `git add -A` stages unwanted files?
- Trust the user's .gitignore configuration
- If concerned, you can run `git status` first to check what will be staged
- User can fix .gitignore and make additional commits if needed

### What if dependencies are circular?
- This shouldn't happen if planning was done correctly
- If detected, notify the user and ask how to proceed
- Suggest breaking the circular dependency

### What if all ready tasks have incomplete dependencies?
- Notify the user that there are no ready tasks
- List tasks and their blocking dependencies
- Wait for user to resolve (maybe some need to be reviewed?)

## Transitioning to Review

When user asks to review a task, switch to the Review Skill. The Review Skill handles:
- Finding commits by task ID
- Navigating through changed files
- Handling approvals and change requests
- Creating fix commits if needed

Don't duplicate review logic here - defer to the Review Skill.

## Key Reminders

- **One task at a time** - Complete current task before moving to next
- **Check dependencies** - Never start a task with incomplete dependencies
- **Update status** - Mark in_progress when starting, committed when done
- **Use edit tool** - Never modify code with shell commands
- **Commit format** - Always "Description (task-id)"
- **Linear commits** - Never amend or rebase
- **Notify user** - Ask about review after each task
- **Stay focused** - Don't mix concerns or implement multiple tasks at once

Once all tasks are committed, the work is ready for final review and merge!
