## 1. Interface & Types

- [x] 1.1 Add `BackendInfo` type and `backendInfo()` method to `TaskBackend` interface in `taskBackend.ts`
- [x] 1.2 Implement `backendInfo()` on `BeadsBackend` returning `{ name: "beads", persistsToFiles: true }`

## 2. In-Memory Backend

- [x] 2.1 Create `src/inMemoryBackend.ts` implementing `TaskBackend` with a `Map<string, Task>` store and sequential `mem-N` IDs
- [x] 2.2 Implement `createTask`, `updateTask`, `listTasks`, `addDependency` methods
- [x] 2.3 Implement `backendInfo()` returning `{ name: "inMemory", persistsToFiles: false }`
- [x] 2.4 Add unit tests for `InMemoryBackend` in `src/test/inMemoryBackend.test.ts`

## 3. Configuration & Activation

- [x] 3.1 Add `misetay.taskBackend` setting to `contributes.configuration` in `package.json` with enum `["beads", "inMemory"]` defaulting to `"beads"`
- [x] 3.2 Update `extension.ts` activation to read the setting and instantiate the chosen backend
- [x] 3.3 Show informational message when activating with in-memory backend

## 4. Backend Info Tool

- [x] 4.1 Register `misetay_backendInfo` language model tool in `taskTools.ts` that calls `backend.backendInfo()`
- [x] 4.2 Add tool definition to `contributes.languageModelTools` in `package.json`

## 5. Skill Updates

- [x] 5.1 Update planning skill to call `misetay_backendInfo` and skip state commit when `persistsToFiles` is false
- [x] 5.2 Update execution skill to call `misetay_backendInfo` and only stage code files (not `.beads/`) when `persistsToFiles` is false
- [x] 5.3 Update review skill to call `misetay_backendInfo` and only stage code files when `persistsToFiles` is false
