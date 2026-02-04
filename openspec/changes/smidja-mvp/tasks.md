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

- [x] 4.1 Create agents/smidja.agent.md with YAML frontmatter
- [x] 4.2 Declare built-in tools (edit, read, search, todo, shell)
- [x] 4.3 Declare Beatrice tools (beatrice_openFile, beatrice_highlightLines, beatrice_navigateToLine)
- [x] 4.4 Declare custom tools (dshearer.smidja/createTask, updateTask, listTasks, addDependency)
- [x] 4.5 Write bare-bones agent prompt covering planning, execution, and review phases

## 5. Initial Installation Command (Agent Only)

- [ ] 5.1 Create VS Code command "Smidja: Install Agent"
- [ ] 5.2 Command copies agents/smidja.agent.md to .github/agents/smidja.agent.md
- [ ] 5.3 Command creates .github/agents/ directory if needed
- [ ] 5.4 Command shows success message with instructions to test

## 6. Planning Skill

- [ ] 6.1 Create skills/planning/SKILL.md
- [ ] 6.2 Define planning dialogue instructions
- [ ] 6.3 Add task breakdown guidance
- [ ] 6.4 Add task creation instructions using createTask/addDependency tools
- [ ] 6.5 Define planning completion criteria

## 7. Execution Skill

- [ ] 7.1 Create skills/execution/SKILL.md
- [ ] 7.2 Add branch creation instructions
- [ ] 7.3 Define task execution loop (ready → in_progress → edit → commit → committed)
- [ ] 7.4 Add commit message format: "Title (task-id)"
- [ ] 7.5 Define task completion and transition logic

## 8. Review Skill

- [ ] 8.1 Create skills/review/SKILL.md
- [ ] 8.2 Add instructions for finding commits (git log --grep)
- [ ] 8.3 Add instructions for finding affected files
- [ ] 8.4 Define file-by-file review flow using Beatrice navigation tools
- [ ] 8.5 Add approval/rejection handling (status updates)
- [ ] 8.6 Add fix commit instructions (append, don't rebase)

## 9. Git Operations Skill

- [ ] 9.1 Create skills/git-ops/SKILL.md
- [ ] 9.2 Define branch creation: git checkout -b feature/...
- [ ] 9.3 Define commit workflow: git add -A, git commit -m "..."
- [ ] 9.4 Add git log commands for finding commits
- [ ] 9.5 Add safety checks (don't commit when review fails, etc.)

## 10. Installation Command (Full)

- [ ] 10.1 Extend "Smidja: Install Agent" command to copy skill files
- [ ] 10.2 Command copies all skill files to .github/skills/
- [ ] 10.3 Command creates full directory structure if needed
- [ ] 10.4 Command shows success message with next steps

## 11. Documentation

- [ ] 11.1 Write README with quick start
- [ ] 11.2 Document Beatrice extension requirement
- [ ] 11.3 Document task backend setup (default: Beads)
- [ ] 11.4 Document GitHub Copilot requirements
- [ ] 11.5 Add workflow examples
- [ ] 11.6 Add troubleshooting guide

## 12. Testing & Validation

- [ ] 12.1 Test planning dialogue flow
- [ ] 12.2 Test task execution creates correct commits
- [ ] 12.3 Test review flow with approvals
- [ ] 12.4 Test review flow with change requests
- [ ] 12.5 Validate task backend integration (Beads)
- [ ] 12.6 Test Beatrice navigation tools integration
- [ ] 12.6 Test Beatrice navigation tools integration
