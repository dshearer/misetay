---
name: misatay-needs-help
description: Resolve tasks where the AI got stuck and needs user guidance
---

# Needs Help Skill

This skill guides you through resolving tasks that are marked as `needs_help`. These are tasks where the AI got stuck during execution and needs the user's input to move forward.

## When to Use This Skill

Use this skill when:
- User asks "what do I need to do?" or "what needs my attention?" and there are `needs_help` tasks
- User wants to work on a specific `needs_help` task
- User notices a `needs_help` task in the task status view and asks about it
- Tasks exist with status `needs_help` and user is ready to help

## Before Starting

1. **List tasks** - Use `dshearer.misatay/listTasks` to find tasks with status `needs_help`
2. **If multiple tasks need help** - Present them to the user and let them pick which to address first

## Needs Help Resolution Flow

### Step 1: Present the Problem

Read the task's description — it should explain what was attempted and what help is needed (the execution skill updates the description before setting `needs_help`).

Present this to the user clearly:

```
"Task <task-id> needs your help: <task title>

Here's what happened:
<summary of what was attempted, from the task description>

What's needed:
<what specific help is needed, from the task description>"
```

If there are partial commits for this task, mention them so the user has full context:

```bash
git log --grep="(task-id)" --format="%H %s"
```

### Step 2: Collaborate with the User

Work with the user to resolve the issue. This varies by situation:

**If the task description was unclear:**
- Ask the user to clarify what they want
- Suggest concrete alternatives if you have ideas
- Once clear, update the task description with the clarified requirements

**If the implementation was difficult:**
- Explain what you tried and why it didn't work
- Ask the user for guidance on approach
- The user may point you to relevant code, docs, or patterns

**If the task conflicts with other tasks:**
- Explain the conflict
- Ask the user how to resolve it (modify this task, modify the other, or restructure)

**Listen to the user.** They know their codebase and requirements better than you do.

### Step 3: Update the Task

Once the issue is resolved, update the task based on the outcome:

**If the task needs to be re-implemented:**

```
Use dshearer.misatay/updateTask:
- taskId: the task ID
- updates: { status: "ready", description: "<updated description with clarified requirements>" }
```

Then suggest switching to the Execution Skill to implement it.

**If the user resolves the issue during this conversation (e.g., provides the answer and you can implement immediately):**

```
Use dshearer.misatay/updateTask:
- taskId: the task ID
- updates: { status: "in_progress" }
```

Then switch to the Execution Skill workflow — implement the changes, mark as committed, and commit.

**If the task should be removed or restructured:**

Work with the user to decide what to do — perhaps the task should be split, merged with another, or deleted entirely.

### Step 4: Confirm Resolution

After updating the task, confirm with the user:

```
"Task <task-id> is now <new status>. <Brief summary of what was decided.>

Would you like to:
- Continue with execution (implement this or other ready tasks)
- Address another needs_help task
- Do something else?"
```

## Surfacing Needs Help Tasks

When the user asks "what do I need to do?", "what needs attention?", or similar, always mention both:

1. **Tasks needing help** (`needs_help` status) - These need user input before the AI can continue
2. **Tasks ready for review** (`committed` status) - These are done and waiting for the user to review

Present `needs_help` tasks first since they're blocking progress:

```
"Here's what needs your attention:

Needs help:
- <task-id>: <title> — <brief reason from description>

Ready for review:
- <task-id>: <title>

Which would you like to address?"
```

## Important Principles

### Don't Guess

If the user's guidance is still unclear after discussion, ask for more clarification rather than guessing. The whole point of `needs_help` is that the AI couldn't figure it out alone.

### Update the Description

Always update the task description to reflect the resolution. Future sessions may need this context.

### Preserve History

If there are partial commits from the failed attempt, don't try to undo them. The Execution Skill will create new commits on top.

### One Task at a Time

Resolve one `needs_help` task before moving to the next. Don't try to batch-resolve multiple stuck tasks.
