## Context

The extension is currently named "Misetay" with the identifier `misetay` used pervasively: package name, VS Code settings prefix (`misetay.taskBackend`), command IDs (`misetay.showTaskStatus`), tool names (`misetay_createTask`), agent filename (`Misetay.agent.md`), and documentation. The name appears ~164 times across 22 files.

## Goals / Non-Goals

**Goals:**
- Rename every occurrence of "misetay" → "misatay" and "Misetay" → "Misatay" across the codebase
- Maintain identical functionality — pure cosmetic rename, no behavior changes
- Regenerate `package-lock.json` after package name change

**Non-Goals:**
- Migration tooling for existing users (pre-release, no installed user base to worry about)
- Backward compatibility shims for old setting/command names
- Renaming the GitHub repo (manual step done separately by the owner)
- Renaming the directory on disk (happens naturally when the repo is renamed)
- Updating archived openspec changes (they are historical records)

## Decisions

### 1. Global find-and-replace approach

**Decision**: Case-sensitive find-and-replace in two passes: `Misetay` → `Misatay` (capitalized) and `misetay` → `misatay` (lowercase).

**Rationale**: The codebase uses exactly two casings — `Misetay` (display name, agent filename) and `misetay` (package name, prefixes, tool names). No other casings exist (no `MISETAY`, no `MiseTay`). Two passes cover everything cleanly.

**Alternatives considered**:
- Regex with case-insensitive flag — unnecessary and risks unintended matches
- Manual file-by-file edits — error-prone with 164 occurrences

### 2. Agent file rename

**Decision**: Rename `agents/Misetay.agent.md` → `agents/Misatay.agent.md` via `git mv`.

**Rationale**: The install command copies this file by exact name to `.github/agents/`. The filename must match the new name. Using `git mv` preserves history.

### 3. Skip package-lock.json manual edits

**Decision**: Delete `package-lock.json` and regenerate via `npm install` after updating `package.json`.

**Rationale**: The lock file has many internal references to the package name. Regenerating is safer and less error-prone than find-and-replace inside it.

### 4. Skip archived changes

**Decision**: Do not modify files under `openspec/changes/archive/`.

**Rationale**: Archives are historical records of past changes. They reference the name as it was at the time. Updating them would be revisionist and provides no value.

### 5. Update openspec specs in-place

**Decision**: Update active specs under `openspec/specs/` via the same find-and-replace.

**Rationale**: Active specs describe current behavior and should reflect the current name. Delta specs in this change will capture what changed.

## Risks / Trade-offs

- **Stale local installs**: Users who ran `misetay.installAgent` will have the old-named agent in `.github/agents/`. → They'll need to re-run the install command (or manually rename). Acceptable for pre-release.
- **GitHub repo URL temporarily wrong**: `package.json` will reference `dshearer/misatay` before the repo is actually renamed. → Rename repo immediately after merging this change.
- **OpenSpec memory/context**: The auto-memory file (`.claude/`) references "Misetay". → Update memory files as part of the change.
