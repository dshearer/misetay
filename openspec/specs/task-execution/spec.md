## ADDED Requirements

### Requirement: Agent executes tasks sequentially
The agent SHALL execute tasks one at a time, respecting dependency order established during planning. The agent SHALL NOT attempt to start tasks that are blocked.

#### Scenario: Task has no dependencies
- **WHEN** task has no dependencies
- **THEN** agent can execute it immediately

#### Scenario: Task depends on incomplete task
- **WHEN** task depends on another task that is not yet committed
- **THEN** agent skips it and works on the next ready task

#### Scenario: Task is blocked
- **WHEN** task status is `blocked`
- **THEN** agent does not attempt to start it and moves to the next ready task

### Requirement: Agent updates task status during execution
The agent SHALL use the updateTask tool to track task status through the execution lifecycle.

#### Scenario: Task execution starts
- **WHEN** agent begins working on a task
- **THEN** agent calls updateTask(taskId, {status: "in_progress"})

#### Scenario: Task implementation complete
- **WHEN** agent finishes making code changes for a task
- **THEN** agent commits changes and calls updateTask(taskId, {status: "committed"})

#### Scenario: Completing a task unblocks dependents
- **WHEN** agent calls updateTask(taskId, {status: "committed"})
- **THEN** the backend automatically transitions any blocked dependent tasks to ready if all their dependencies are met

### Requirement: Agent commits each task separately
The agent SHALL create one git commit per task with the task ID in the commit message.

#### Scenario: Task changes are ready
- **WHEN** agent completes code changes for a task
- **THEN** agent runs `git add -A && git commit -m "Task description (task-id)"`

#### Scenario: Commit message includes task ID
- **WHEN** agent creates a commit for a task
- **THEN** commit message includes the task ID in format "(task-id)"

### Requirement: Agent notifies human after each task
The agent SHALL notify the human when a task is complete and ask if they want to review before proceeding.

#### Scenario: Task committed
- **WHEN** agent commits a task
- **THEN** agent sends message "Task <id> complete. Ready to review?"

#### Scenario: Human declines review
- **WHEN** human responds "no" or "later" to review prompt
- **THEN** agent proceeds to next ready task

#### Scenario: Human accepts review
- **WHEN** human responds "yes" to review prompt
- **THEN** agent enters review flow for that task

### Requirement: Agent uses edit tool for code changes
The agent SHALL use the built-in edit tool to make all code modifications.

#### Scenario: Task requires code changes
- **WHEN** agent needs to modify code for a task
- **THEN** agent uses the edit tool, not shell commands or file writes

### Requirement: Agent sets needs_help when stuck
The agent SHALL set a task's status to `needs_help` when it cannot make progress due to problems with the task description or implementation difficulty.

#### Scenario: Task description is too vague
- **WHEN** agent determines the task description is too vague, contradictory, or doesn't fit with other tasks
- **THEN** agent follows the needs_help workflow (update description, commit progress, set status)

#### Scenario: Agent struggles with implementation
- **WHEN** agent has made genuine effort but cannot figure out how to implement the task (e.g., cannot fix a bug, cannot find the right approach)
- **THEN** agent follows the needs_help workflow (update description, commit progress, set status)

### Requirement: Agent follows needs_help workflow steps in order
When the agent decides it needs help, it SHALL follow these steps in order: update the task description, commit any progress, then set the status.

#### Scenario: Needs help workflow execution
- **WHEN** agent decides it needs help on a task
- **THEN** agent performs these steps in order:
  1. Calls updateTask to update the task description explaining what has been done and what kind of help is needed
  2. Commits any work in progress (using the same commit format as normal task commits)
  3. Calls updateTask(taskId, {status: "needs_help"})

#### Scenario: No progress to commit
- **WHEN** agent decides it needs help before making any code changes
- **THEN** agent skips the commit step and only updates the description and sets status to `needs_help`

### Requirement: Agent moves to next task after setting needs_help
The agent SHALL proceed to the next ready task after setting a task to `needs_help`, rather than stopping execution.

#### Scenario: Other tasks are ready
- **WHEN** agent sets a task to `needs_help` and other tasks have status `ready`
- **THEN** agent proceeds to the next ready task

#### Scenario: No other tasks are ready
- **WHEN** agent sets a task to `needs_help` and no other tasks have status `ready`
- **THEN** agent notifies the user that no tasks are available and lists what needs attention

### Requirement: Agent surfaces needs_help tasks when user asks what to do
The agent SHALL inform the user about tasks with `needs_help` status when the user asks what they need to do or what needs attention.

#### Scenario: User asks what needs to be done
- **WHEN** user asks "what do I need to do?" or similar
- **THEN** agent mentions tasks with status `committed` (ready for review) and tasks with status `needs_help` (need user attention)
