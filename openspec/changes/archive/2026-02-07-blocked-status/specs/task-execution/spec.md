## MODIFIED Requirements

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
