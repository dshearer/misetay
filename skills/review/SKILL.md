---
name: misetay-review
description: Guided code review flow with file navigation and approval handling
---

# Review Skill

This skill guides you through reviewing completed tasks with the user, showing them the changes and handling their feedback.

## When to Use This Skill

Use this skill when:
- User asks to review a task
- User responds "yes" or "review" after a task is committed
- User explicitly says "show me task X" or "review the changes"
- User wants to see what was done for a specific task

## Review Flow

### Step 1: Find Task Commits

Use git log to find all commits associated with the task ID:

```bash
# Find all commits for a task
git log --grep="(task-id)" --format="%H %s"
```

This returns commit hashes and messages for all commits that include the task ID.

**Handle multiple commits:**
- If a task has multiple commits, that's normal (initial commit + fix commits from prior reviews)
- All commits are part of the review
- Show files from the most recent commit state (HEAD)

### Step 2: Identify Affected Files

Determine which files were modified by the task:

```bash
# Get list of unique files modified by task commits
git log --grep="(task-id)" --name-only --format=""
```

This returns a list of file paths that were touched by any commit for this task.

**De-duplicate the file list** if the same file appears multiple times.

### Step 3: Open and Explain Files

For each affected file, guide the user through the changes using the navigation tools:

**For each file:**

1. **Open the file** at current HEAD using `dshearer.misetay/openFile`:
   - filePath: path to the file (relative to workspace root)
   - line: (optional) line number to start at

2. **Highlight relevant sections** using `dshearer.misetay/highlightLines`:
   - startLine: first line of the changed code
   - endLine: last line of the changed code
   - Use this to draw attention to specific changes

3. **Center code in viewport** using `dshearer.misetay/navigateToLine`:
   - line: the line number to center
   - Use this to ensure important code is visible

4. **Explain in chat** what was done and why:
   - Describe the changes made to this file
   - Explain the purpose and reasoning
   - Point out any important details or decisions
   - Keep explanations conversational and clear

**Important**: Show files at their **current state (HEAD)**, not as diffs. The user can see diffs in their git tool if needed. Your job is to provide context and narrative.

**Important**: Do the review SLOWLY. Do not continue to the next item until the user tells you to.

**Navigation Example:**

```
Let me show you what changed in src/components/Button.tsx...

[Opens file with dshearer.misetay/openFile]
[Highlights lines 45-67 with dshearer.misetay/highlightLines]

I've updated the Button component to use theme colors from the ThemeContext. 
The main change is on lines 45-67 where the button now reads from the 
theme context and applies the appropriate color based on the theme.variant prop.

Previously it was using hard-coded colors. Now it dynamically adapts to 
light/dark mode.
```

### Step 4: Handle Review Feedback

After showing all files, **ask the user for feedback**:

```
"That's everything for this task. What do you think?

- If it looks good, I can mark it as reviewed
- If you'd like changes, let me know what to adjust"
```

**Wait for user response.**

### Step 5: Process Approval or Changes

#### Scenario: User Approves

If user says something like:
- "looks good"
- "approved"
- "ship it"
- "LGTM"
- "✓"

**Then:**

1. **Mark task as reviewed** using `dshearer.misetay/updateTask`:
   - taskId: the task ID
   - updates: { status: "reviewed" }

2. **Confirm to user**:
   ```
   "✅ Marked task <task-id> as reviewed!"
   ```

#### Scenario: User Requests Changes

If user requests modifications or points out issues:

**Then:**

1. **Update task status to in_progress** using `dshearer.misetay/updateTask`:
   - taskId: the task ID
   - updates: { status: "in_progress" }

2. **Make the requested changes** using the edit tool
   - Address the user's feedback
   - Make focused changes only

3. **Mark task as committed** using `dshearer.misetay/updateTask`:
   - taskId: the task ID
   - updates: { status: "committed" }

4. **Commit the fix** with a descriptive message:

   Call `dshearer.misetay/backendInfo`. If `persistsToFiles` is true, stage all changes (code + task state files). If `persistsToFiles` is false, stage only your code changes (not `.beads/`).

   ```bash
   # If persistsToFiles is true:
   git add -A

   # If persistsToFiles is false:
   # Stage only specific code files you changed (not .beads/)
   git add <file1> <file2> ...

   # Commit with task ID in message
   git commit -m "Fix <description of what was fixed> (task-id)"
   ```

5. **Ask if they want to review the fix**:
   ```
   "I've fixed <what you fixed>. Would you like to review the changes, 
   or should I mark this as approved?"
   ```

**Continue the review cycle** until user approves.

### Step 6: Multiple Review Rounds

A task may go through multiple review iterations. That's expected and fine.

**Important principles:**

- **Append fixes, don't rebase**: Each fix is a new commit, preserving chronological history
- **Include task ID in fix commits**: Format is `"Fix <description> (task-id)"`
- **Never amend or rebase**: Keep the commit history intact
- **Each round is a new review**: User may request changes multiple times
- **Do the review slowly and one item at a time**

**Example commit history for a task:**
```
abc123 Add user authentication API integration (bd-xyz7)
def456 Fix error handling for invalid credentials (bd-xyz7)
ghi789 Fix typo in error message (bd-xyz7)
```

All three commits are part of task bd-xyz7. Each commit moves the task forward.

## Important Principles

### Show Current State, Not Diffs

- Open files at their current HEAD state
- Let the user use their git tools for diffs if they want
- Your role is to provide narrative and context, not to be a diff viewer

### Use Navigation Tools

Always use the Misetay navigation tools:
- `dshearer.misetay/openFile` - Opens a file
- `dshearer.misetay/highlightLines` - Highlights a range of lines
- `dshearer.misetay/navigateToLine` - Centers a line in the viewport

### Explain, Don't Just Show

- Opening files alone isn't helpful
- Always accompany file navigation with chat explanations
- Tell the user **what** changed and **why**
- Make the review conversational and educational

### Respect User Decisions

- If user approves, mark as reviewed immediately
- If user requests changes, make them without argument
- Don't defend your code - improve it based on feedback
- The user is the ultimate decision-maker

### Preserve Commit History

- **Never amend commits** during review
- **Never rebase** to "clean up" review fixes
- Each fix is a new commit with the same task ID
- Chronological history is valuable for understanding how work evolved

## Example Review Session

```
User: "Review task bd-abc3"

Agent: "Let me show you what was done for task bd-abc3: Update Button component to use theme colors"

[Runs: git log --grep="(bd-abc3)" --format="%H %s"]
[Runs: git log --grep="(bd-abc3)" --name-only --format=""]
[Finds: src/components/Button.tsx, src/components/Button.test.tsx]

Agent: "I'll walk you through the changes. First, let's look at the Button component..."

[Opens src/components/Button.tsx]
[Highlights lines 45-67]

Agent: "I've updated the Button component to use theme colors from the ThemeContext.
The main change is on lines 45-67 where the button now reads from the theme 
context and applies the appropriate color based on the theme.variant prop.

[Highlights lines 12-15]

Here at the top, I've added the useContext hook to access the theme.

Now let's look at the tests..."

[Opens src/components/Button.test.tsx]
[Highlights lines 78-95]

Agent: "I added tests to verify the button renders with correct colors in both 
light and dark modes. These tests mock the ThemeContext and check that the 
right CSS classes are applied.

That's everything for this task. What do you think?

- If it looks good, I can mark it as reviewed
- If you'd like changes, let me know what to adjust"

User: "Looks good!"

Agent: "✅ Marked task bd-abc3 as reviewed!"
```

## Common Scenarios

### Scenario: No Files Changed

If git log shows no files (rare, but possible for meta tasks):

```
"This task didn't modify any files - it may have been a planning or 
documentation-only task. Should I mark it as reviewed?"
```

### Scenario: Many Files Changed

If a task touched many files (10+), consider grouping by concern:

```
"This task modified 15 files. Let me group them by area:

Configuration files: (3 files)
- config/theme.ts
- config/colors.ts
- config/index.ts

Components: (8 files)
- src/components/Button.tsx
- src/components/Input.tsx
- ...

Tests: (4 files)
- ...

Would you like me to walk through each area, or focus on specific files?"
```

### Scenario: User Unclear Feedback

If user's feedback is ambiguous:

```
User: "Hmm, not sure about this"

Agent: "What specifically concerns you? Is there a particular file or 
section you'd like me to change?"
```

Get clarity before making changes.
