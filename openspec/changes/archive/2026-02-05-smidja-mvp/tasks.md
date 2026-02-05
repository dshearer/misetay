## 1. Project Setup

- [x] 1.1 Initialize VS Code extension project structure
- [x] 1.2 Configure package.json with extension metadata
- [x] 1.3 Set up TypeScript build configuration
- [x] 1.4 Add Beads as dependency/requirement in docs

## 2. Task Management Tools

- [x] 2.1 Implement createTask tool (dshearer.smidja/createTask)
- [x] 2.2 Implement updateTask tool (dshearer.smidja/updateTask)
- [x] 2.3 Implement listTasks tool (dshearer.smidja/listTasks)
- [x] 2.4 Implement addDependency tool (dshearer.smidja/addDependency)
- [x] 2.5 Create task backend adapter interface
- [x] 2.6 Implement Beads CLI adapter (default backend)
- [x] 2.7 Register all task tools in extension activation
- [x] 2.8 Add tool tests

## 3. Agent Definition

- [x] 3.1 Create agents/smidja.agent.md with YAML frontmatter
- [x] 3.2 Declare built-in tools (edit, read, search, todo, shell)
- [x] 3.3 Declare custom tools (dshearer.smidja/createTask, updateTask, listTasks, addDependency, openFile, highlightLines, navigateToLine)
- [x] 3.4 Write bare-bones agent prompt covering planning, execution, and review phases

## 4. Initial Installation Command (Agent Only)

- [x] 4.1 Create VS Code command "Smidja: Install Agent"
- [x] 4.2 Command copies agents/smidja.agent.md to .github/agents/smidja.agent.md
- [x] 4.3 Command creates .github/agents/ directory if needed
- [x] 4.4 Command shows success message with instructions to test

## 5. Task Status View

- [x] 6.1 Create VS Code command "Smidja: Show Task Status"
- [x] 6.2 Create webview panel with HTML/CSS/JS for modern UI
- [x] 6.3 Implement task list rendering with status indicators
- [x] 6.4 Add visual task dependency display (tree or indented structure)
- [x] 6.5 Implement real-time view updates when tasks change
- [x] 6.6 Add click handlers for task details modal/panel
- [x] 6.7 Add context menu actions (view commits, review task, mark reviewed)
- [x] 6.8 Use VS Code CSS variables for theme compatibility
- [x] 6.9 Design welcoming empty state with quick start guidance
- [x] 6.10 Implement startingTask tool (dshearer.smidja/startingTask)
- [x] 6.11 Implement workingOnTask tool (dshearer.smidja/workingOnTask)
- [x] 6.12 Implement stoppingTask tool (dshearer.smidja/stoppingTask)
- [x] 6.13 Add spinner animation for tasks with active work
- [x] 6.14 Implement 7-minute heartbeat timeout logic
- [x] 6.15 Register heartbeat tools in extension activation
- [x] 6.16 Apply modern design: animations, typography, spacing, colors
- [x] 6.17 Test view with different VS Code themes (light/dark/high-contrast)
- [x] 6.18 Test view responsiveness at different panel widths

## 7. Planning Skill

- [x] 7.1 Create skills/planning/SKILL.md
- [x] 7.2 Define planning dialogue instructions
- [x] 7.3 Add task breakdown guidance
- [x] 7.4 Add task creation instructions using createTask/addDependency tools
- [x] 7.5 Define planning completion criteria

## 8. Execution Skill

- [x] 8.1 Create skills/execution/SKILL.md
- [x] 8.2 Add branch creation instructions
- [x] 8.3 Define task execution loop (ready → in_progress → edit → commit → committed)
- [x] 8.4 Add commit message format: "Title (task-id)"
- [x] 8.5 Define task completion and transition logic

## 9. Review Skill

- [x] 9.1 Create skills/review/SKILL.md
- [x] 9.2 Add instructions for finding commits (git log --grep)
- [x] 9.3 Add instructions for finding affected files
- [x] 8.4 Define file-by-file review flow using navigation tools
- [x] 9.5 Add approval/rejection handling (status updates)
- [x] 9.6 Add fix commit instructions (append, don't rebase)

## 10. Installation Command (Full)

- [x] 9.1 Extend "Smidja: Install Agent" command to copy skill files
- [x] 9.2 Command copies all skill files to .github/skills/
- [x] 9.3 Command creates full directory structure if needed
- [x] 9.4 Command shows success message with next steps
