# Misetay - AI Agent Tool that Keeps You in the Loop

When you build software with Misetay, you are __involved__ and __in charge__. 

When Misetay says "All done!", you actually believe it! You're ready to:
- __Slam that merge button__, or
- Pester your colleagues for PR approvals without shame, or
- Deploy, then close your laptop and have a drink

Because: You've already reviewed the code! You were there from the beginning!

## Manifesto

To make the best use of AI, AIs and people need to work side-by-side.

### The Non-Future

- Swarms of agents are fun to play with but **they are not the future of work**
- Businesses will not put up with things running around doing God-knows-what and **no one to blame** when things go wrong

### The Future

- AI will boost productivity by **empowering human workers**, to __understand more__ and to __build more__

## Features

- **Planning**: Break projects into reviewable tasks collaboratively with AI
- **Sequential Execution**: AI works through tasks one at a time, committing each to Git in order to map tasks to changes
- **Flexible Review**: You review task changes whenever convenient, in whatever order, without blocking work. Moreover,
Misetay _walks you through the changes_, at your pace.
- **Persistent State**: Task tracking across VS Code sessions using pluggable backends

## Comparison

### Plain VS Code with Copilot

The diff-based review experience provided in VS Code's Copilot Chat is _excellent_ --- but it doesn't scale to big projects.
If, for example, you tell Copilot "Go make me a Minecraft" (and you've pre-approved all the tools it needs), then let it run
for an hour, you'll come back to a pile of new code that you won't want to review.

Misetay, in contrast, helps you break the project into tasks. You can then tell it to go to work, and it will work on those
tasks _while remembering what changes belong to what tasks_ (using Git, of course). When you come back, you can review the completed
tasks one by one, in whatever order you want.

### Agents Galore

The extreme opposite of Misetay is [Gastown](https://steve-yegge.medium.com/welcome-to-gas-town-4f25ee16dd04), a very interesting experiment!
With agentic development, you unleash multiple (perhaps very many!) AI sessions on a project, and use some kind of harness to try to get them
to do something productive. The advantage of this is clear: When it works, you end up with the software you wanted without any person having to
write a line of it.

The disadvantages are also clear:
- **No person wrote a line of it**
- **It's very inefficient (and hence expensive).** For instance, AI agents tend to spend a lot of time and tokens screwing around in dead-ends; that's why
people came up with [Ralph](https://github.com/snarktank/ralph) and other such harnesses. They also need to spend tokens reviewing the basics of 
the project each time their context runs out.

### Old-Fashioned Hand-Coding

Misetay is, in fact, closer to hand-coding than to Gastown. Misetay has a disadvantage that keeps it from being a clear winner over hand-coding:
inference slowness. It takes minutes for any AI model to do a significant code change. What's the user supposed to do while waiting? This is
where the temptation to deploy fleets of agents comes from.

But imagine that it takes your AI one second to "Build the authentication module with unit tests", rather than one minute. If we had this kind of
performance --- if the user did not have to wait very long for the AI --- then I think that the Misetay approach to AI coding would be quite
competitive with hand-coding and agent fleets.

Sadly, we don't have this yet. But perhaps in the near future?

## Requirements

### Required Extensions

- **GitHub Copilot**: Provides the AI agent and code generation capabilities

### Required Tools

- **Task Backend** (default: [Beads](https://beads.dev))
  - Install Beads CLI: `brew install beads` (or via npm/go)
  - Alternative backends: Linear, GitHub Issues, JIRA, etc.
