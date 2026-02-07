## MODIFIED Requirements

### Requirement: View displays all tasks with status indicators
The view SHALL show all tasks from the task backend with visual status indicators.

#### Scenario: Viewing tasks with different statuses
- **WHEN** task status view is open
- **THEN** view displays tasks grouped or colored by status (needs_help, ready, in_progress, committed, reviewed)

## ADDED Requirements

### Requirement: View displays needs_help status with distinct styling
The view SHALL display tasks with `needs_help` status using a distinct color and visual treatment that signals urgency.

#### Scenario: Needs help task styling
- **WHEN** a task has status `needs_help`
- **THEN** view displays the task card with an orange border and orange status badge (using `--vscode-charts-orange`)

### Requirement: View groups needs_help tasks at the top
The view SHALL display `needs_help` tasks before all other status groups to ensure they are the first thing the user sees.

#### Scenario: Status group ordering
- **WHEN** task status view renders tasks grouped by status
- **THEN** groups appear in order: needs_help, in_progress, ready, committed, reviewed
