### Requirement: In-memory backend implements TaskBackend interface
The InMemoryBackend class SHALL implement the full TaskBackend interface, storing all task data in extension memory with no external dependencies.

#### Scenario: Creating a task
- **WHEN** agent calls createTask(title, description, status) on InMemoryBackend
- **THEN** backend stores the task in memory and returns it with a unique ID

#### Scenario: Task ID format
- **WHEN** a task is created via InMemoryBackend
- **THEN** the returned ID follows the format "mem-N" where N is a sequential integer starting at 1

#### Scenario: Updating a task
- **WHEN** agent calls updateTask(id, updates) on InMemoryBackend
- **THEN** backend updates the specified fields and returns the updated task

#### Scenario: Updating a nonexistent task
- **WHEN** agent calls updateTask with an ID that does not exist
- **THEN** backend throws an error indicating the task was not found

#### Scenario: Listing all tasks
- **WHEN** agent calls listTasks() on InMemoryBackend with no filters
- **THEN** backend returns all stored tasks

#### Scenario: Filtering tasks by status
- **WHEN** agent calls listTasks({status: "ready"}) on InMemoryBackend
- **THEN** backend returns only tasks with status "ready"

#### Scenario: Adding a dependency
- **WHEN** agent calls addDependency(childId, parentId) on InMemoryBackend
- **THEN** backend records the dependency so that childId's dependencies array includes parentId

### Requirement: In-memory backend does not persist across sessions
Task data in InMemoryBackend SHALL exist only in extension memory and SHALL NOT survive VS Code restarts.

#### Scenario: Restarting VS Code
- **WHEN** user closes and reopens VS Code while using InMemoryBackend
- **THEN** all previously created tasks are gone and listTasks returns an empty array

#### Scenario: New chat session within same VS Code session
- **WHEN** user starts a new chat conversation without restarting VS Code
- **THEN** tasks created in prior conversations are still available via listTasks

### Requirement: In-memory backend reports its capabilities
InMemoryBackend SHALL implement backendInfo() returning metadata that identifies it as non-file-persisting.

#### Scenario: Querying backend info
- **WHEN** backendInfo() is called on InMemoryBackend
- **THEN** it returns `{ name: "inMemory", persistsToFiles: false }`
