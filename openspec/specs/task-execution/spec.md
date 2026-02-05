## ADDED Requirements

### Requirement: Agent executes tasks sequentially
The agent SHALL execute tasks one at a time, respecting dependency order established during planning.

#### Scenario: Task has no dependencies
- **WHEN** task has no dependencies
- **THEN** agent can execute it immediately

#### Scenario: Task depends on incomplete task
- **WHEN** task depends on another task that is not yet committed
- **THEN** agent waits until dependency is committed before starting

### Requirement: Agent creates feature branch
The agent SHALL create a new git branch for the feature before executing the first task.

#### Scenario: First task execution
- **WHEN** agent starts executing the first task
- **THEN** agent runs `git checkout -b feature/<name>` to create a branch

### Requirement: Agent updates task status during execution
The agent SHALL use the updateTask tool to track task status through the execution lifecycle.

#### Scenario: Task execution starts
- **WHEN** agent begins working on a task
- **THEN** agent calls updateTask(taskId, {status: "in_progress"})

#### Scenario: Task implementation complete
- **WHEN** agent finishes making code changes for a task
- **THEN** agent commits changes and calls updateTask(taskId, {status: "committed"})

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
