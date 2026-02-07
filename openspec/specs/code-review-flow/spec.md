## ADDED Requirements

### Requirement: Agent shows files at current HEAD
The agent SHALL open and display files at their current state (HEAD), not as diffs.

#### Scenario: User requests review of a task
- **WHEN** user asks to review a task
- **THEN** agent opens files at current HEAD that were modified by that task

### Requirement: Agent finds commits by task ID
The agent SHALL use git log to find all commits associated with a task ID.

#### Scenario: Task has one commit
- **WHEN** agent needs to find commits for a task
- **THEN** agent runs `git log --grep="task-id"` to locate commits

#### Scenario: Task has multiple commits
- **WHEN** task has been modified after initial commit
- **THEN** agent finds all commits with that task ID in the message

### Requirement: Agent identifies affected files
The agent SHALL determine which files were modified by a task using git log.

#### Scenario: Finding task's files
- **WHEN** agent needs to know which files a task touched
- **THEN** agent runs `git log --grep="task-id" --name-only --format=""`

### Requirement: Agent uses navigation tools to show code
The agent SHALL use openFile, highlightLines, and navigateToLine tools to guide the user through changes.

#### Scenario: Opening a file for review
- **WHEN** agent shows a file that was modified
- **THEN** agent calls dshearer.misatay/openFile with the file path

#### Scenario: Highlighting relevant sections
- **WHEN** agent wants to draw attention to specific code
- **THEN** agent calls dshearer.misatay/highlightLines with appropriate line range

#### Scenario: Centering code in viewport
- **WHEN** agent wants to ensure code is visible
- **THEN** agent calls dshearer.misatay/navigateToLine to center it

### Requirement: Agent explains changes in chat
The agent SHALL provide narrative explanation of what was done and why in the chat alongside the file navigation.

#### Scenario: Showing file changes
- **WHEN** agent opens a file during review
- **THEN** agent explains in chat what changes were made and their purpose

### Requirement: Agent handles review feedback
The agent SHALL respond appropriately to approval or change requests.

#### Scenario: User approves changes
- **WHEN** user indicates approval (e.g., "looks good", "approved")
- **THEN** agent calls updateTask(taskId, {status: "reviewed"})

#### Scenario: User requests changes
- **WHEN** user requests modifications
- **THEN** agent updates status to "in_progress", makes changes, and appends a new commit

### Requirement: Review changes are appended, not rebased
The agent SHALL create new commits for review fixes, not amend or rebase existing commits.

#### Scenario: User requests a fix during review
- **WHEN** user asks for changes to a committed task
- **THEN** agent makes changes and creates new commit with format "Fix <description> (task-id)"

#### Scenario: Multiple review rounds
- **WHEN** task goes through multiple review iterations
- **THEN** each fix creates a new commit, preserving chronological history
