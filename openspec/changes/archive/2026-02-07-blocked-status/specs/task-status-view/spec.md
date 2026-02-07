## MODIFIED Requirements

### Requirement: View displays all tasks with status indicators
The view SHALL show all tasks from the task backend with visual status indicators.

#### Scenario: Viewing tasks with different statuses
- **WHEN** task status view is open
- **THEN** view displays tasks grouped by status in order: in_progress, ready, blocked, committed, reviewed

### Requirement: View uses modern design aesthetic
The view SHALL use contemporary design patterns including smooth animations, clear typography, and refined color palette.

#### Scenario: Visual design standards
- **WHEN** task status view is rendered
- **THEN** view uses:
  - Smooth transitions and animations for status changes
  - Clear visual hierarchy with modern typography
  - Thoughtful use of color for status indicators including orange for blocked tasks
  - Card-based or list-based layout with proper spacing
  - Responsive design that adapts to panel width

## ADDED Requirements

### Requirement: Blocked tasks have distinct visual styling
The view SHALL display blocked tasks with distinct styling that differentiates them from ready tasks.

#### Scenario: Blocked task card styling
- **WHEN** a task has status `blocked`
- **THEN** view renders the task card with an orange left border and orange status badge using `--vscode-charts-orange`

#### Scenario: Blocked section grouping
- **WHEN** blocked tasks exist
- **THEN** view groups them in a "BLOCKED" section between "READY" and "COMMITTED" sections
