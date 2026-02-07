## 1. Type and Interface Changes

- [x] 1.1 Add `blocked` to the `TaskStatus` type union in `src/taskBackend.ts`

## 2. InMemoryBackend Logic

- [x] 2.1 In `addDependency`, after recording the dependency, set child to `blocked` if parent is not `committed` or `reviewed`
- [x] 2.2 In `updateTask`, when status changes to `committed` or `reviewed`, find all tasks depending on this task and transition them from `blocked` to `ready` if all their dependencies are met
- [x] 2.3 In `updateTask`, reject transitions from `blocked` to `in_progress` with an error message

## 3. BeadsBackend Logic

- [x] 3.1 Update `fromBeadsStatus` to map Beads `blocked` status to Misatay `blocked` instead of `ready`
- [x] 3.2 Update `toBeadsStatusAndLabels` to map Misatay `blocked` to Beads `blocked` status
- [x] 3.3 In `addDependency`, after calling `bd dep add`, check parent status and set child to `blocked` if parent is incomplete
- [x] 3.4 In `updateTask`, when status changes to `committed` or `reviewed`, find dependent tasks and unblock those with all dependencies met
- [x] 3.5 In `updateTask`, reject transitions from `blocked` to `in_progress` with an error message

## 4. Task View Styling

- [x] 4.1 Add `--status-blocked: var(--vscode-charts-orange)` CSS variable in `webview/taskStatus.html`
- [x] 4.2 Add `.task-card.blocked` and `.task-status.blocked` CSS rules using the orange color
- [x] 4.3 Add `blocked` to the `statusOrder` array in `taskStatusView.ts` between `ready` and `committed`

## 5. Tests

- [x] 5.1 Add InMemoryBackend tests: `addDependency` blocks child when parent is incomplete
- [x] 5.2 Add InMemoryBackend tests: `updateTask` to `committed` unblocks dependents with all deps met
- [x] 5.3 Add InMemoryBackend tests: `updateTask` keeps dependents blocked when not all deps are met
- [x] 5.4 Add InMemoryBackend tests: reject `blocked` to `in_progress` transition
