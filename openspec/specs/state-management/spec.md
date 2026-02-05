## ADDED Requirements

### Requirement: Extension provides task management tools
The VS Code extension SHALL register custom tools for task operations.

#### Scenario: createTask tool registration
- **WHEN** extension activates
- **THEN** extension registers dshearer.smidja/createTask tool

#### Scenario: updateTask tool registration
- **WHEN** extension activates
- **THEN** extension registers dshearer.smidja/updateTask tool

#### Scenario: listTasks tool registration
- **WHEN** extension activates
- **THEN** extension registers dshearer.smidja/listTasks tool

#### Scenario: addDependency tool registration
- **WHEN** extension activates
- **THEN** extension registers dshearer.smidja/addDependency tool

### Requirement: Tools delegate to pluggable backend
The extension SHALL support multiple task backend implementations through an adapter interface.

#### Scenario: Backend adapter interface
- **WHEN** extension needs to perform task operations
- **THEN** extension delegates to configured backend adapter

#### Scenario: Default Beads backend
- **WHEN** no backend is explicitly configured
- **THEN** extension uses Beads CLI backend adapter

### Requirement: createTask returns task ID
The createTask tool SHALL create a task and return its unique identifier.

#### Scenario: Creating a task
- **WHEN** agent calls createTask(title, description, status)
- **THEN** tool creates task in backend and returns task ID

#### Scenario: Task ID format
- **WHEN** task is created successfully
- **THEN** returned task ID follows backend's format (e.g., "bd-abc1" for Beads)

### Requirement: updateTask modifies task fields
The updateTask tool SHALL update specified fields of an existing task.

#### Scenario: Updating task status
- **WHEN** agent calls updateTask(taskId, {status: "committed"})
- **THEN** tool updates only the status field in backend

#### Scenario: Updating multiple fields
- **WHEN** agent calls updateTask with multiple field updates
- **THEN** tool updates all specified fields atomically

### Requirement: listTasks supports filtering
The listTasks tool SHALL support filtering tasks by status and branch.

#### Scenario: Listing all tasks
- **WHEN** agent calls listTasks()
- **THEN** tool returns all tasks for current project

#### Scenario: Filtering by status
- **WHEN** agent calls listTasks({status: "ready"})
- **THEN** tool returns only tasks with "ready" status

### Requirement: addDependency establishes task ordering
The addDependency tool SHALL record that one task depends on another.

#### Scenario: Creating dependency
- **WHEN** agent calls addDependency(childId, parentId)
- **THEN** tool records that childId cannot start until parentId is committed

### Requirement: State persists across sessions
Task state SHALL persist across VS Code sessions and chat conversations.

#### Scenario: Restarting VS Code
- **WHEN** user closes and reopens VS Code
- **THEN** task state remains unchanged in backend

#### Scenario: New chat session
- **WHEN** user starts new chat with agent
- **THEN** agent can call listTasks to retrieve ongoing work
