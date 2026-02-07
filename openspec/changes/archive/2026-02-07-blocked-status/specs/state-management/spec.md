## ADDED Requirements

### Requirement: addDependency auto-blocks child tasks
The addDependency tool SHALL automatically set the child task's status to `blocked` when the parent task is not yet complete.

#### Scenario: Adding dependency on incomplete parent
- **WHEN** agent calls addDependency(childId, parentId) and parentId status is `ready` or `in_progress`
- **THEN** tool sets childId status to `blocked`

#### Scenario: Adding dependency on completed parent
- **WHEN** agent calls addDependency(childId, parentId) and parentId status is `committed` or `reviewed`
- **THEN** tool does not change childId status

#### Scenario: Child already blocked
- **WHEN** agent calls addDependency(childId, parentId) and childId status is already `blocked`
- **THEN** tool keeps childId status as `blocked`

### Requirement: Completing a task unblocks dependents
When a task is marked `committed` or `reviewed`, the backend SHALL check all tasks that depend on it and transition them from `blocked` to `ready` if all their dependencies are now met.

#### Scenario: Single dependency met
- **WHEN** agent calls updateTask(parentId, {status: "committed"}) and childId depends only on parentId and childId status is `blocked`
- **THEN** backend sets childId status to `ready`

#### Scenario: Multiple dependencies, not all met
- **WHEN** agent calls updateTask(parentId, {status: "committed"}) and childId depends on parentId and otherParentId and otherParentId is not yet `committed` or `reviewed`
- **THEN** backend keeps childId status as `blocked`

#### Scenario: Multiple dependencies, all met
- **WHEN** agent calls updateTask(parentId, {status: "committed"}) and childId depends on parentId and otherParentId and both are now `committed` or `reviewed`
- **THEN** backend sets childId status to `ready`

### Requirement: Guard against starting blocked tasks
The updateTask tool SHALL reject status transitions from `blocked` to `in_progress`.

#### Scenario: Agent tries to start a blocked task
- **WHEN** agent calls updateTask(taskId, {status: "in_progress"}) and taskId status is `blocked`
- **THEN** tool returns an error: "Cannot start task <taskId>: task is blocked by incomplete dependencies"

## MODIFIED Requirements

### Requirement: updateTask modifies task fields
The updateTask tool SHALL update specified fields of an existing task.

#### Scenario: Updating task status
- **WHEN** agent calls updateTask(taskId, {status: "committed"})
- **THEN** tool updates the status field in backend and checks for blocked dependents to unblock

#### Scenario: Updating multiple fields
- **WHEN** agent calls updateTask with multiple field updates
- **THEN** tool updates all specified fields atomically

### Requirement: addDependency establishes task ordering
The addDependency tool SHALL record that one task depends on another and update the child's status if needed.

#### Scenario: Creating dependency
- **WHEN** agent calls addDependency(childId, parentId)
- **THEN** tool records that childId cannot start until parentId is committed, and sets childId to `blocked` if parentId is not yet complete
