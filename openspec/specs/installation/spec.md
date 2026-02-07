# Agent Installation

## Context

Misatay's intelligence lives in agent and skill files that must be copied to the user's workspace `.github/` directory. This spec defines how those files get installed.

## Requirements

### R1: Installation Command

The extension SHALL provide a VS Code command to install Misatay into the current workspace.

**Command ID**: `misatay.installAgent`
**Command Label**: "Misatay: Install Agent"

### R2: File Installation

When the install command executes, it SHALL:
1. Create `.github/agents/` directory if it doesn't exist
2. Copy agent definition to `.github/agents/misatay.agent.md`
3. Create `.github/skills/` directory if it doesn't exist
4. Copy all skill files to `.github/skills/` preserving directory structure:
   - `planning/SKILL.md`
   - `execution/SKILL.md`
   - `review/SKILL.md`
   - `git-ops/SKILL.md`

### R3: Overwrite Behavior

The command SHALL overwrite existing files without prompting to ensure users can update to latest versions.

### R4: Success Feedback

After successful installation, the command SHALL:
1. Show an information message: "Misatay agent installed successfully"
2. Include next steps in the message (e.g., "Start chatting with @misatay to plan your tasks")

### R5: Error Handling

If installation fails (e.g., permission issues, no workspace open), the command SHALL:
1. Show an error message explaining what went wrong
2. Not create partial directory structures

## Acceptance Criteria

### AC1: Fresh Installation
- **GIVEN** a workspace with no `.github/` directory
- **WHEN** user runs "Misatay: Install Agent" command
- **THEN** agent and skills are copied to `.github/agents/` and `.github/skills/`
- **AND** success message is displayed

### AC2: Update Installation
- **GIVEN** a workspace with existing Misatay files
- **WHEN** user runs "Misatay: Install Agent" command
- **THEN** existing files are overwritten with new versions
- **AND** success message is displayed

### AC3: No Workspace Error
- **GIVEN** no workspace folder is open in VS Code
- **WHEN** user runs "Misatay: Install Agent" command
- **THEN** error message is displayed
- **AND** no files are created

## Test Scenarios

### Scenario 1: Command Registration
```
GIVEN extension is activated
WHEN checking available commands
THEN "misatay.installAgent" is registered
```

### Scenario 2: Directory Creation
```
GIVEN workspace has no .github directory
WHEN install command runs
THEN .github/agents/ and .github/skills/ directories exist
AND all expected files are present
```

### Scenario 3: Preserves Other Files
```
GIVEN workspace has .github/other-file.md
WHEN install command runs
THEN .github/other-file.md still exists
AND Misatay files are added alongside it
```
