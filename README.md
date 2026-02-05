# Misetay - AI Agent Tool that Keeps You in the Loop

When you build software with Misetay, you are __involved__ and __in charge__. 

When Misetay says "All done!", you actually believe it! You're ready to:
- __Slam that merge button__, or
- Pester your colleages for PR approvals without shame, or
- Deploy, then close your laptop and have a drink

Because: You've already reviewed the code! You were there from the begining!

## Manifesto

### The Non-Future

- To make the best use of AI, we need to **SLOW DOWN**
- Swarms of agents are fun to play with but **they are not the future of work**
- Businesses will not put up with things running around doing God-knows-what and **no one to blame** when things go wrong

### The Future

- AI will boost productivity by **empowering human workers**, to __understand more__ and to __build more__

## Features

- **Planning Dialogue**: Break projects into reviewable tasks collaboratively with AI
- **Sequential Execution**: AI works through tasks one at a time, committing each separately
- **Flexible Review**: Review tasks whenever convenient, request changes that append as new commits
- **Persistent State**: Task tracking across VS Code sessions using pluggable backends

## Requirements

### Required Extensions

- **GitHub Copilot**: Provides the AI agent and code generation capabilities

### Required Tools

- **Task Backend** (default: [Beads](https://beads.dev))
  - Install Beads CLI: `brew install beads` (or via npm/go)
  - Alternative backends: Linear, GitHub Issues, JIRA, etc.
