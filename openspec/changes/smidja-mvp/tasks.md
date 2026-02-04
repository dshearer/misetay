## 1. Project Setup

- [x] 1.1 Initialize VS Code extension project structure
- [x] 1.2 Configure package.json with extension metadata
- [x] 1.3 Set up TypeScript build configuration
- [x] 1.4 Add Beads as dependency/requirement in docs

## 2. Beatrice Dependency

- [x] 2.1 Add Beatrice extension as extensionDependency in package.json
- [x] 2.2 Document Beatrice installation requirement in README
- [x] 2.3 Verify Beatrice tools are available when extension activates

## 3. Task Management Tools

- [x] 3.1 Implement createTask tool (dshearer.smidja/createTask)
- [x] 3.2 Implement updateTask tool (dshearer.smidja/updateTask)
- [x] 3.3 Implement listTasks tool (dshearer.smidja/listTasks)
- [x] 3.4 Implement addDependency tool (dshearer.smidja/addDependency)
- [x] 3.5 Create task backend adapter interface
- [x] 3.6 Implement Beads CLI adapter (default backend)
- [x] 3.7 Register all task tools in extension activation
- [x] 3.8 Add tool tests

## 4. Agent Definition

- [ ] 4.1 Create agents/smidja.agent.md with YAML frontmatter
- [ ] 4.2 Declare built-in tools (edit, read, search, todo, shell)
- [ ] 4.3 Declare Beatrice tools (beatrice_openFile, beatrice_highlightLines, beatrice_navigateToLine)
- [ ] 4.4 Declare custom tools (dshearer.smidja/createTask, updateTask, listTasks, addDependency)
- [ ] 4.5 Write bare-bones agent prompt covering planning, execution, and review phases

## 5. Planning Skill

- [ ] 5.1 Create skills/planning/SKILL.md
- [ ] 5.2 Define planning dialogue instructions
- [ ] 5.3 Add task breakdown guidance
- [ ] 5.4 Add task creation instructions using createTask/addDependency tools
- [ ] 5.5 Define planning completion criteria

## 6. Execution Skill

- [ ] 6.1 Create skills/execution/SKILL.md
- [ ] 6.2 Add branch creation instructions
- [ ] 6.3 Define task execution loop (ready → in_progress → edit → commit → committed)
- [ ] 6.4 Add commit message format: "Title (task-id)"
- [ ] 6.5 Define task completion and transition logic

## 7. Review Skill

- [ ] 7.1 Create skills/review/SKILL.md
- [ ] 7.2 Add instructions for finding commits (git log --grep)
- [ ] 7.3 Add instructions for finding affected files
- [ ] 7.4 Define file-by-file review flow using Beatrice navigation tools
- [ ] 7.5 Add approval/rejection handling (status updates)
- [ ] 7.6 Add fix commit instructions (append, don't rebase)

## 8. Git Operations Skill

- [ ] 8.1 Create skills/git-ops/SKILL.md
- [ ] 8.2 Define branch creation: git checkout -b feature/...
- [ ] 8.3 Define commit workflow: git add -A, git commit -m "..."
- [ ] 8.4 Add git log commands for finding commits
- [ ] 8.5 Add safety checks (don't commit when review fails, etc.)

## 9. Installation Command

- [ ] 9.1 Create VS Code command "Smidja: Install Agent"
- [ ] 9.2 Command copies agent definition to .github/agents/
- [ ] 9.3 Command copies all skill files to .github/skills/
- [ ] 9.4 Command creates directory structure if needed
- [ ] 9.5 Command shows success message with next steps

## 10. Documentation

- [ ] 10.1 Write README with quick start
- [ ] 10.2 Document Beatrice extension requirement
- [ ] 10.3 Document task backend setup (default: Beads)
- [ ] 10.4 Document GitHub Copilot requirements
- [ ] 10.5 Add workflow examples
- [ ] 10.6 Add troubleshooting guide

## 11. Testing & Validation

- [ ] 11.1 Test planning dialogue flow
- [ ] 11.2 Test task execution creates correct commits
- [ ] 11.3 Test review flow with approvals
- [ ] 11.4 Test review flow with change requests
- [ ] 11.5 Validate task backend integration (Beads)
- [ ] 11.6 Test Beatrice navigation tools integration
