## Context

The task-execution and git-orchestration specs currently document that the agent should create feature branches before executing tasks. However, the actual implementation (skills/execution/SKILL.md) does not implement this behavior - the agent works on whatever branch is currently checked out.

This is a documentation-only change to align the specs with the existing implementation.

## Goals / Non-Goals

**Goals:**
- Update specs to accurately reflect current implementation behavior
- Remove incorrect requirement about feature branch creation
- Clarify that users manage their own git branching strategy

**Non-Goals:**
- No code changes required - implementation is already correct
- No changes to agent behavior or skills
- No changes to user workflow

## Decisions

### Decision: Remove feature branch requirement from spec only

**Rationale:** The implementation already works correctly by committing to the current branch. The spec incorrectly documented behavior that was never implemented. Updating the spec removes this discrepancy without requiring any code changes.

**Alternatives considered:**
- Implement feature branch creation to match spec → Rejected: Would add complexity users don't need
- Leave spec as-is → Rejected: Specs should document actual behavior, not aspirational features

## Risks / Trade-offs

**Risk:** None - this is a documentation correction only.

**Trade-off:** Users must understand they need to manage their own branching (checkout desired branch before running agent).
→ **Mitigation:** The updated git-orchestration spec explicitly documents that the agent works on current branch and includes a scenario showing user-managed branching.
