## ADDED Requirements

### Requirement: TaskStatus type includes needs_help
The TaskStatus type SHALL include `needs_help` as a valid status value, alongside `ready`, `in_progress`, `committed`, and `reviewed`.

#### Scenario: TaskStatus type definition
- **WHEN** TaskStatus type is defined
- **THEN** it includes the values `'ready' | 'in_progress' | 'committed' | 'reviewed' | 'needs_help'`

### Requirement: Beads backend maps needs_help to open with label
The BeadsBackend SHALL map the `needs_help` status to Beads status `open` with label `"needs_help"`.

#### Scenario: Mapping needs_help to Beads
- **WHEN** a task's status is set to `needs_help`
- **THEN** BeadsBackend sets Beads status to `open` and adds label `"needs_help"`

#### Scenario: Mapping Beads open with needs_help label back
- **WHEN** a Beads task has status `open` and label `"needs_help"`
- **THEN** BeadsBackend returns Misatay status `needs_help`

#### Scenario: Beads open without needs_help label still maps to ready
- **WHEN** a Beads task has status `open` without label `"needs_help"`
- **THEN** BeadsBackend returns Misatay status `ready`

### Requirement: Beads backend manages needs_help label on status transitions
The BeadsBackend SHALL remove the `needs_help` label when a task transitions away from the `needs_help` status, following the same pattern used for `committed` and `reviewed` labels.

#### Scenario: Transitioning from needs_help to in_progress
- **WHEN** a task with status `needs_help` is updated to `in_progress`
- **THEN** BeadsBackend removes the `"needs_help"` label and sets Beads status to `in_progress`

#### Scenario: Transitioning from needs_help to ready
- **WHEN** a task with status `needs_help` is updated to `ready`
- **THEN** BeadsBackend removes the `"needs_help"` label (Beads status remains `open`)
