## MODIFIED Requirements

### Requirement: Extension provides a task backend setting
The extension SHALL contribute a `misatay.taskBackend` configuration setting that allows users to select which task backend to use.

#### Scenario: Setting exists with correct schema
- **WHEN** user opens VS Code settings and searches for "misatay"
- **THEN** a `misatay.taskBackend` setting is available with options "beads" and "inMemory"

#### Scenario: Default value
- **WHEN** user has not configured `misatay.taskBackend`
- **THEN** the setting defaults to "beads"

### Requirement: Extension instantiates backend from setting
The extension SHALL read the `misatay.taskBackend` setting at activation and instantiate the corresponding backend.

#### Scenario: Setting is "beads"
- **WHEN** `misatay.taskBackend` is "beads" and extension activates
- **THEN** extension instantiates BeadsBackend

#### Scenario: Setting is "inMemory"
- **WHEN** `misatay.taskBackend` is "inMemory" and extension activates
- **THEN** extension instantiates InMemoryBackend

### Requirement: In-memory mode shows informational message
The extension SHALL display an informational message when activating with the in-memory backend, warning that tasks will not persist.

#### Scenario: Activation with in-memory backend
- **WHEN** extension activates with `misatay.taskBackend` set to "inMemory"
- **THEN** extension displays an information message stating tasks will be lost on restart

#### Scenario: Activation with beads backend
- **WHEN** extension activates with `misatay.taskBackend` set to "beads"
- **THEN** no informational message about task persistence is shown

### Requirement: Setting change takes effect immediately
Changing the `misatay.taskBackend` setting SHALL hot-swap the active backend without requiring a window reload.

#### Scenario: Changing setting mid-session
- **WHEN** user changes `misatay.taskBackend` from "beads" to "inMemory"
- **THEN** the extension instantiates a new InMemoryBackend and all tools and views use it immediately

#### Scenario: Switching notifies user
- **WHEN** user changes `misatay.taskBackend`
- **THEN** extension displays an informational message confirming the switch

#### Scenario: Task status view refreshes on switch
- **WHEN** user changes `misatay.taskBackend` while the task status view is open
- **THEN** the view refreshes to show tasks from the new backend
