## 1. Package Identity

- [x] 1.1 Rename `name`, `displayName`, repo URL, and configuration `title` in `package.json`
- [x] 1.2 Rename all `misetay.*` setting keys to `misatay.*` in `package.json`
- [x] 1.3 Rename all `misetay.*` command IDs and titles in `package.json`
- [x] 1.4 Rename all `misetay_*` tool names in `package.json`
- [x] 1.5 Delete `package-lock.json` and regenerate with `npm install`

## 2. Source Code

- [x] 2.1 Find-and-replace `misetay` → `misatay` (case-sensitive) across all `src/*.ts` files
- [x] 2.2 Find-and-replace `Misetay` → `Misatay` (case-sensitive) across all `src/*.ts` files
- [x] 2.3 Verify extension compiles with `npm run compile`

## 3. Agent and Skills

- [x] 3.1 `git mv agents/Misetay.agent.md agents/Misatay.agent.md`
- [x] 3.2 Find-and-replace `misetay`/`Misetay` → `misatay`/`Misatay` in `agents/Misatay.agent.md`
- [x] 3.3 Find-and-replace `misetay`/`Misetay` → `misatay`/`Misatay` in all `skills/*/SKILL.md` files

## 4. Webview

- [x] 4.1 Find-and-replace `Misetay` → `Misatay` in `webview/taskStatus.html` and `webview/taskStatusEmpty.html`

## 5. Documentation

- [x] 5.1 Find-and-replace `misetay`/`Misetay` → `misatay`/`Misatay` in `README.md`
- [x] 5.2 Find-and-replace `misetay`/`Misetay` → `misatay`/`Misatay` in `CHANGELOG.md`
- [x] 5.3 Find-and-replace `misetay`/`Misetay` → `misatay`/`Misatay` in `.github/copilot-instructions.md`

## 6. OpenSpec Specs

- [x] 6.1 Find-and-replace `misetay`/`Misetay` → `misatay`/`Misatay` across all `openspec/specs/*/spec.md` files

## 7. Verification

- [x] 7.1 Run `npm run compile` and confirm no errors
- [x] 7.2 Run tests with `npm test`
- [x] 7.3 Grep for any remaining `misetay` occurrences (excluding `package-lock.json`, `node_modules`, and `openspec/changes/archive/`)
