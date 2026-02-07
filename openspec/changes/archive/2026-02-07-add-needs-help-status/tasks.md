## 1. Type and Backend

- [x] 1.1 Add `needs_help` to the `TaskStatus` type union in `src/taskBackend.ts`
- [x] 1.2 Add `needs_help` case to `toBeadsStatusAndLabels` in `src/beadsBackend.ts` — map to `{ status: 'open', label: 'needs_help' }`
- [x] 1.3 Update `fromBeadsStatus` in `src/beadsBackend.ts` — check for `needs_help` label on `open` tasks before defaulting to `ready`
- [x] 1.4 Add `needs_help` to the label cleanup list in `updateTask` in `src/beadsBackend.ts` (alongside `committed` and `reviewed`)

## 2. Task Status View

- [x] 2.1 Add `--status-needs-help: var(--vscode-charts-orange)` CSS variable and `.needs_help` card/badge styles in `webview/taskStatus.html`
- [x] 2.2 Add `needs_help` as the first entry in the `statusOrder` array in `src/taskStatusView.ts`

## 3. Agent Prompts and Skills

- [x] 3.1 Add `needs_help` to the Task States list in `agents/Misatay.agent.md`
- [x] 3.2 Add a "Requesting Help" section to `skills/execution/SKILL.md` describing when to set `needs_help` and the 3-step workflow (update description, commit progress, set status)
- [x] 3.3 Update the execution skill to instruct the agent to move to the next ready task after setting `needs_help`
- [x] 3.4 Create `skills/needs-help/SKILL.md` — a dedicated skill for resolving `needs_help` tasks (read task description, present problem, collaborate with user, set task back to `ready` or `in_progress`)
- [x] 3.5 Update `agents/Misatay.agent.md` to reference the Needs Help Skill in the skills list and Getting Started routing
