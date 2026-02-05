## ADDED Requirements

### Requirement: Agent engages in task breakdown dialogue
The agent SHALL engage in interactive dialogue with the user to decompose a project or feature into discrete, reviewable tasks.

#### Scenario: User describes high-level feature
- **WHEN** user describes a feature request in chat
- **THEN** agent asks clarifying questions to understand requirements and scope

#### Scenario: Agent proposes task breakdown
- **WHEN** agent has sufficient information about the feature
- **THEN** agent proposes a breakdown of the work into separate tasks

#### Scenario: User approves task breakdown
- **WHEN** user approves the proposed task breakdown
- **THEN** agent creates tasks using the createTask tool

### Requirement: Tasks are sized for reviewability
The agent SHALL propose tasks that are small enough to review in one sitting, typically representing one logical change.

#### Scenario: Task represents single logical change
- **WHEN** agent proposes a task
- **THEN** task scope represents a single cohesive change (e.g., "Add theme context" not "Implement entire dark mode")

#### Scenario: Complex work is broken into steps
- **WHEN** feature requires multiple related changes
- **THEN** agent breaks it into separate tasks with dependencies

### Requirement: Dependencies between tasks are captured
The agent SHALL use the addDependency tool to establish dependencies when tasks must be completed in a specific order.

#### Scenario: Task depends on another task
- **WHEN** task B requires task A to be completed first
- **THEN** agent calls addDependency(taskB, taskA) to record the dependency

#### Scenario: Independent tasks have no dependencies
- **WHEN** tasks can be completed in any order
- **THEN** agent does not create dependencies between them

### Requirement: Planning dialogue is collaborative
The agent SHALL work with the user to refine the task breakdown, not dictate it.

#### Scenario: User suggests changes to task breakdown
- **WHEN** user disagrees with proposed task breakdown
- **THEN** agent adjusts the breakdown based on user feedback

#### Scenario: User adds or removes tasks
- **WHEN** user identifies missing work or unnecessary tasks
- **THEN** agent modifies the task list accordingly
