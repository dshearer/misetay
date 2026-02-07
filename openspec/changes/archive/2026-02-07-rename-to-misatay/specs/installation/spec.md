## MODIFIED Requirements

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

### R4: Success Feedback

After successful installation, the command SHALL:
1. Show an information message: "Misatay agent installed successfully"
2. Include next steps in the message (e.g., "Start chatting with @misatay to plan your tasks")
