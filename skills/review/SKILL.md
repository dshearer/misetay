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

Think of this as a "tour" of the changes you made for a task. Your first job is to plan the tour as a series of "stops"
based on your code changes shown in the task commits.

### Phase 1: Plan the Tour

#### Step 1: Find Task Commits

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

#### Step 2: Identify Affected Files

Determine which files were modified by the task:

```bash
# Get list of unique files modified by task commits
git log --grep="(task-id)" --name-only --format=""
```

This returns a list of file paths that were touched by any commit for this task.

**De-duplicate the file list** if the same file appears multiple times.

#### Step 3: Plan the Tour

Make a tour plan. A plan consists of a sequence of "stops" each of
which specifies (1) a code file and a line range and (2) what you want to tell the user about the file
and line range.

### Phase 2: Take the User on the Tour

Once the user has confirmed that they are ready for the tour, follow these steps for each of the stops
in your tour plan (in order):

1. Open the file with the `dshearer.misetay/openFile` tool
2. Highlight the line range using the `dshearer.misetay/highlightLines` tool
3. Make the line range visible with the `dshearer.misetay/navigateToLine` tool
4. Say what you planned to say about the code. Make sure it fits in your broader narrative. Tell the user
what this code does and why it matters.
5. Before moving to the next stop, check off the todo item corresponding to this stop (with the `todo` tool)

**Important**: Show files at their **current state (HEAD)**, not as diffs. The user can see diffs in their git tool if needed. Your job is to provide context and narrative.

**Important**: Do the review SLOWLY. Do not continue to the next item until the user tells you to.

Write like a knowledgeable coworker giving a walkthrough.

**Always wait for the user between tour stops.** After explaining a stop:
- Do NOT auto-advance to the next file
- The user controls the pace

When the user asks a question during a tour:
- **Brief question** (clarification): Answer in 1-2 sentences, then ask "Ready to continue the tour?"
- **Deep-dive request** ("show me how that works", "dig deeper into X"): Create a mini sub-tour for that topic, then return to the main tour
- **Off-topic question**: Answer briefly, remind them where you were in the tour, offer to continue

**How to tell the difference:**
- Contains a question mark or question words → it's a question, answer it
- Says "show me", "go to", "open" → navigation request, adjust the tour
- Says "skip", "next", "continue", "ok", "got it" → continuation signal, proceed
- Says "stop", "cancel", "enough" → end the tour gracefully

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

Do you have any questions or comments, or would you like me to show you the next
change?
```

### Phase 3: Review Feedback and Action Items

After showing all files, **ask the user for feedback**:

```
"That's everything for this task. What do you think?

- If it looks good, I can mark it as reviewed
- If you'd like changes, let me know what to adjust"
```

**Wait for user response.**

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

### Multiple Review Rounds

A task may go through multiple review iterations. That's expected and fine.

**Important principles:**

- **Append fixes, don't rebase**: Each fix is a new commit, preserving chronological history
- **Include task ID in fix commits**: Format is `"Fix <description> (task-id)"`
- **Never amend or rebase**: Keep the commit history intact
- **Each round is a new review**: User may request changes multiple times

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
