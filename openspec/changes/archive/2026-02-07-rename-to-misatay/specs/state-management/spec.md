## MODIFIED Requirements

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
