## Why

People mispronounce "Misetay." Renaming to "Misatay" makes pronunciation intuitive — it reads as it sounds.

## What Changes

- **BREAKING**: Rename VS Code extension package from `misetay` to `misatay` (affects extension ID, settings prefix, command IDs)
- **BREAKING**: Rename all `misetay.*` configuration keys to `misatay.*`
- **BREAKING**: Rename all `misetay.*` command IDs to `misatay.*`
- Rename agent file from `Misetay.agent.md` to `Misatay.agent.md` and update all internal references
- Update all display strings, skill references, and documentation from "Misetay" to "Misatay"
- Update GitHub repo URL from `dshearer/misetay` to `dshearer/misatay` (requires separate GitHub repo rename)
- Update openspec specs that reference the name

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `installation`: Agent/skill file names and install paths change from misetay to misatay
- `state-management`: Configuration key prefix changes from `misetay.*` to `misatay.*`
- `task-status-view`: Webview references and display name change
- `code-review-flow`: Skill references to agent name change
- `backend-settings`: Settings key prefix changes

## Impact

- **package.json**: ~18 occurrences — name, displayName, settings keys, command IDs, repo URL
- **Source files** (src/*.ts): ~43 occurrences — settings reads, command registrations, context keys
- **Agent/skills** (agents/, skills/): ~37 occurrences — agent filename rename + content updates
- **Webview** (webview/): ~5 occurrences — display strings
- **Docs** (README.md, CHANGELOG.md, .github/): ~27 occurrences
- **Specs** (openspec/specs/): ~39 occurrences across 5 spec files
- **GitHub**: Repo rename from `dshearer/misetay` to `dshearer/misatay` (manual step)
- **Total**: ~164 occurrences across 22 files (excluding package-lock.json and archived changes)
