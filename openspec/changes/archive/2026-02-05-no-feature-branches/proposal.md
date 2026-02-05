## Why

The current specs describe the agent creating feature branches before executing tasks, but the actual implementation doesn't do this - it works on the current branch. The specs need to be updated to accurately reflect what the code does.

## What Changes

- Update `task-execution` spec to remove feature branch creation requirement
- Update `git-orchestration` spec to reflect that the agent works on the current branch
- Align spec documentation with actual implementation behavior

## Capabilities

### New Capabilities

None - this change only updates documentation to match existing behavior.

### Modified Capabilities

- `task-execution`: Remove the requirement to create feature branches, reflecting actual implementation.
- `git-orchestration`: Update to reflect working on current branch instead of creating new branches.

## Impact

**Behavior:**
- No behavior changes - the code already works on the current branch
- Specs will now accurately document what the implementation does
