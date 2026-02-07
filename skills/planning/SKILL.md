---
name: misatay-planning
description: Interactive planning dialogue to break down projects into reviewable tasks
---

# Planning Skill

This skill guides you through collaborative task planning with the user.

## When to Use This Skill

Use this skill when:
- User describes a new feature or project to implement
- User asks to plan or break down work
- Starting a new feature branch with no existing tasks
- User says something like "I need to add...", "Let's build...", "Help me implement..."

## Planning Dialogue Process

### Step 1: Understand Requirements

Ask clarifying questions to fully understand what needs to be built:

- What is the goal or purpose of this feature?
- Who are the users? What problem does this solve?
- Are there specific requirements, constraints, or preferences?
- Are there existing patterns in the codebase to follow?
- What does "done" look like?

**Take time to understand before proposing tasks.** Don't rush to decomposition.

### Step 2: Propose Task Breakdown

Based on the requirements, propose a breakdown of the work into discrete tasks.

**Task Sizing Guidelines:**

- Each task should represent **one logical, reviewable change**
- Tasks should be **small enough to review in one sitting** (typically 30-60 minutes of work)
- A task is too big if it touches multiple subsystems or has multiple concerns
- A task is too small if it's a single line change with no context

**Good Task Examples:**
- "Add ThemeContext provider with light/dark state"
- "Create color palette constants for dark mode"
- "Update Button component to use theme colors"

**Bad Task Examples:**
- "Implement entire dark mode feature" (too big, not reviewable)
- "Change button color to #333" (too small, no context)

**Present the breakdown to the user:**

```
Here's how I'd break this down:

1. [Task Title] - [Brief description]
2. [Task Title] - [Brief description]
   - Depends on: Task 1
3. [Task Title] - [Brief description]
   - Depends on: Task 2

Does this breakdown make sense? Any tasks to add, remove, or split?
```

### Step 3: Refine with User Feedback

**Be collaborative, not dictatorial.** The user knows their codebase and priorities.

- If user suggests changes, adjust the breakdown accordingly
- If user identifies missing work, add new tasks
- If user thinks a task is too big, split it further
- If user thinks tasks are too granular, combine them

**Keep iterating until user approves the plan.**

### Step 4: Create Tasks

Once the user approves, create tasks using the tools:

**First**, call `dshearer.misatay/initTaskSystem` to ensure the task system is initialized in the workspace. This is safe to call even if already initialized.

**For each task in the approved breakdown:**

1. **Create the task** using `dshearer.misatay/createTask`:
   - title: "Task Title"
   - description: "Detailed description of what needs to be done, why, and any relevant context"
   - status: "ready"
   - Returns: task ID (e.g., "bd-abc1")

2. **Add dependencies if needed** using `dshearer.misatay/addDependency`:
   - childTaskId: The task that must wait
   - parentTaskId: The task that must be completed first
   - Only add when task B genuinely requires task A to be done first

**Dependency Guidelines:**

- Add dependency when task B **requires** task A's code to work
- Add dependency when task B **logically follows** task A (e.g., tests after implementation)
- Don't add dependency if tasks are **independent** and can be done in any order
- Don't over-constrain - allow parallelization when possible

### Step 5: Commit Planning State

After creating all tasks, call `dshearer.misatay/backendInfo` to check the backend type.

**If `persistsToFiles` is true:** Commit the task state to Git:

```bash
git add -A
git commit -m "Plan feature: <feature name>"
```

This creates a commit containing the `.beads/issues.jsonl` changes from planning.

**If `persistsToFiles` is false:** Skip the commit — in-memory tasks have no files to stage. Just confirm that tasks were created successfully.

### Step 6: Confirm Completion

After creating the plan (and committing if applicable):

1. List the created tasks to confirm they're in the system using `dshearer.misatay/listTasks`

2. Present a summary to the user:
   ```
   ✅ Created 5 tasks for dark mode feature:
   
   - bd-abc1: Add ThemeContext provider
   - bd-abc2: Create color palette (depends on bd-abc1)
   - bd-abc3: Update Button component (depends on bd-abc2)
   - bd-abc4: Update Header component (depends on bd-abc2)
   - bd-abc5: Add dark mode toggle (depends on bd-abc3, bd-abc4)
   
   Ready to start implementing? I'll begin with task bd-abc1.
   ```

## Planning Completion Criteria

Planning is complete when:

✅ All tasks have been created with clear titles and descriptions  
✅ Dependencies are established where needed  
✅ User has approved the breakdown  
✅ Task list has been confirmed via listTasks()  
✅ Planning state has been committed to Git

After planning is complete:
- Switch to execution skill to start implementing tasks
- Or wait for user to review the plan and ask you to proceed

## Examples

### Example 1: Simple Feature

```
User: "Add a loading spinner to the submit button"

You: "I can help with that! A few questions:

- Should the spinner appear while the form is submitting, then disappear?
- Do you have a preferred spinner component or library, or should I create one?
- Should the button be disabled while loading?"

User: "Yes to all, and we use react-spinners library"

You: "Perfect! Here's how I'd break this down:

1. Add loading state to submit handler
2. Update Button component to accept isLoading prop
3. Integrate Spinner from react-spinners into Button
4. Add disabled state when loading

This should be 3-4 small commits. Does this work?"

User: "Looks good, but combine tasks 2 and 3"

You: "Got it! Updated breakdown:

1. Add loading state to submit handler  
2. Update Button component with isLoading prop and Spinner
3. Add disabled state when loading (depends on task 2)

Should I create these tasks?"

User: "Yes"

You: [Creates tasks using createTask and addDependency tools]

"✅ Created 3 tasks. Ready to start with task 1?"
```

### Example 2: Complex Feature Requiring Clarification

```
User: "Add user authentication"

You: "Authentication is a broad feature! Let me understand the requirements:

- What type of auth? (Email/password, OAuth, magic links, etc.)
- Do you have a backend API, or do we need to set that up too?
- What pages/routes should be protected?
- Should we store sessions in localStorage, cookies, or something else?
- Any existing auth library you prefer (like Auth0, Supabase, Firebase)?"

User: "Email/password, we have a backend API at /api/auth, protect the /dashboard route, use localStorage, no external library"

You: "Thanks! Here's my proposed breakdown:

1. Create AuthContext provider with login/logout/state
2. Add login form component
3. Add API integration for login endpoint
4. Add protected route wrapper for /dashboard
5. Add logout functionality
6. Add token storage in localStorage
7. Add auto-login on page load (check stored token)

Dependencies:
- Tasks 2, 3, 4, 6 depend on task 1 (context must exist first)
- Task 7 depends on task 6 (token storage must work first)

This gives us 7 reviewable commits. Thoughts?"

User: "Looks comprehensive! Let's do it"

You: [Creates 7 tasks with appropriate dependencies]

"✅ Created 7 tasks for authentication feature. I'll start with task 1 (AuthContext). Should I also create a feature branch?"
```

## Key Reminders

- **Collaborative, not dictatorial** - Work WITH the user, not for them
- **Size for reviewability** - One logical change, not too big or too small
- **Clear descriptions** - Future you (and the user) should understand what each task does
- **Minimal dependencies** - Only add when truly necessary
- **Confirm before acting** - Get approval before creating tasks
- **Stay in phase** - Complete planning before switching to execution

**IMPORTANT**: If the user asks you to start executing the plan (and the plan is done and all tasks have been
created), then use the "execution" skill to do this.