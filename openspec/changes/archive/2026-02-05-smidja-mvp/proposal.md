## Why

Building software with AI coding assistants often feels like a black box - the AI disappears for minutes or hours, then returns with changes that may or may not be what you wanted. Reviewing large diffs after the fact is cognitively expensive and breaks the collaborative flow. Human engineers need to stay in the loop throughout the development process, maintaining context and providing guidance, without being blocked by sequential review steps.

## What Changes

Create Smidja, a VS Code extension that orchestrates collaborative "pair programming" between humans and GitHub Copilot. Unlike traditional AI coding tools that work in isolation, Smidja keeps the human engaged through:

- **Planning dialogue**: Break projects into reviewable tasks collaboratively
- **Async execution**: AI works through tasks sequentially, committing each one
- **Flexible review**: Review tasks whenever convenient, request changes that append as new commits
- **Persistent state**: Use Beads to track task status across sessions

The human maintains control and context while the AI handles implementation details.

## Capabilities

### New Capabilities

- `planning-dialogue`: Interactive chat to decompose projects into tasks with dependencies
- `task-execution`: Sequential AI-driven implementation using GitHub Copilot's edit tool
- `code-review-flow`: File navigation tools to review task changes in VS Code
- `state-management`: Beads integration for persistent task tracking and status
- `git-orchestration`: Automated commit management per task

### Modified Capabilities

_(none - new project)_

## Impact

- **Users**: Need to install Beads CLI and have GitHub Copilot
- **Workflow**: Shifts from "AI does everything then human reviews" to "continuous collaboration"
- **Git history**: Linear commits with task IDs, append-only fixes (no rebasing)
- **State**: `.beads/` directory tracked in git for persistence
