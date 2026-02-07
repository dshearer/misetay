### Requirement: Extension provides task management tools
The VS Code extension SHALL register custom tools for task operations.

#### Scenario: createTask tool registration
- **WHEN** extension activates
- **THEN** extension registers dshearer.misatay/createTask tool

#### Scenario: updateTask tool registration
- **WHEN** extension activates
- **THEN** extension registers dshearer.misatay/updateTask tool

#### Scenario: listTasks tool registration
- **WHEN** extension activates
- **THEN** extension registers dshearer.misatay/listTasks tool

#### Scenario: addDependency tool registration
- **WHEN** extension activates
- **THEN** extension registers dshearer.misatay/addDependency tool

### Requirement: Tools delegate to pluggable backend
The extension SHALL support multiple task backend implementations through an adapter interface. The active backend is determined by the `misatay.taskBackend` configuration setting.

#### Scenario: Backend adapter interface
- **WHEN** extension needs to perform task operations
- **THEN** extension delegates to configured backend adapter

#### Scenario: Default Beads backend
- **WHEN** `misatay.taskBackend` is not explicitly configured
- **THEN** extension uses Beads CLI backend adapter

#### Scenario: In-memory backend selected
- **WHEN** `misatay.taskBackend` is set to "inMemory"
- **THEN** extension uses InMemoryBackend adapter

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
Task state persistence SHALL depend on the active backend. File-backed backends (Beads) persist across sessions. In-memory backends do not.

#### Scenario: Restarting VS Code with Beads backend
- **WHEN** user closes and reopens VS Code while using BeadsBackend
- **THEN** task state remains unchanged

#### Scenario: Restarting VS Code with in-memory backend
- **WHEN** user closes and reopens VS Code while using InMemoryBackend
- **THEN** all task state is lost

#### Scenario: New chat session
- **WHEN** user starts new chat with agent (without restarting VS Code)
- **THEN** agent can call listTasks to retrieve tasks regardless of backend

### Requirement: Extension registers backendInfo tool
The extension SHALL register a `misatay_backendInfo` language model tool that returns metadata about the active backend.

#### Scenario: backendInfo tool registration
- **WHEN** extension activates
- **THEN** extension registers dshearer.misatay/backendInfo tool

#### Scenario: Calling backendInfo with Beads backend
- **WHEN** agent calls backendInfo and active backend is BeadsBackend
- **THEN** tool returns `{ name: "beads", persistsToFiles: true }`

#### Scenario: Calling backendInfo with in-memory backend
- **WHEN** agent calls backendInfo and active backend is InMemoryBackend
- **THEN** tool returns `{ name: "inMemory", persistsToFiles: false }`

### Requirement: TaskBackend interface includes backendInfo method
The TaskBackend interface SHALL include a `backendInfo()` method returning a `BackendInfo` object with `name` and `persistsToFiles` fields.

#### Scenario: BackendInfo return type
- **WHEN** any backend's backendInfo() is called
- **THEN** it returns an object with string `name` and boolean `persistsToFiles`
