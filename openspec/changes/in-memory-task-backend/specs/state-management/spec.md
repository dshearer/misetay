## ADDED Requirements

### Requirement: Extension registers backendInfo tool
The extension SHALL register a `misetay_backendInfo` language model tool that returns metadata about the active backend.

#### Scenario: backendInfo tool registration
- **WHEN** extension activates
- **THEN** extension registers dshearer.misetay/backendInfo tool

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

## MODIFIED Requirements

### Requirement: Tools delegate to pluggable backend
The extension SHALL support multiple task backend implementations through an adapter interface. The active backend is determined by the `misetay.taskBackend` configuration setting.

#### Scenario: Backend adapter interface
- **WHEN** extension needs to perform task operations
- **THEN** extension delegates to configured backend adapter

#### Scenario: Default Beads backend
- **WHEN** `misetay.taskBackend` is not explicitly configured
- **THEN** extension uses Beads CLI backend adapter

#### Scenario: In-memory backend selected
- **WHEN** `misetay.taskBackend` is set to "inMemory"
- **THEN** extension uses InMemoryBackend adapter

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
