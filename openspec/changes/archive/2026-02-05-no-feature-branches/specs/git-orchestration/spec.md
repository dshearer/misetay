## MODIFIED Requirements

### Requirement: Agent works on current branch
The agent SHALL make all commits on whatever branch is currently checked out, without creating new branches.

#### Scenario: Executing tasks
- **WHEN** agent executes tasks
- **THEN** agent commits to the current git branch without creating new branches

#### Scenario: User manages branching
- **WHEN** user wants to work on a feature branch
- **THEN** user checks out the desired branch before starting the agent
