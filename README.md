# Misetay - AI Agent Tool that Keeps You in the Loop

When you build software with Misetay, you are __involved__ and __in charge__. 

When Misetay says "All done!", you actually believe it! You're ready to:
- __Slam that merge button__, or
- Pester your colleagues for PR approvals without shame, or
- Deploy, then close your laptop and have a drink

Because: You've already reviewed the code! You were there from the beginning!

## Project Status

This is an experiment, although I do try to make Misetay useful for real work.

I am interested in finding ways to use AI in software development that _keep the engineer in the driver's seat_. Do you have ideas? **Open an issue!**

This brings us to the project's Manifesto:

## Manifesto

To make the best use of AI, AIs and people need to work side-by-side.

### The Non-Future

- Swarms of agents are fun to play with but **they are not the future of work**
- Businesses will not put up with things running around doing God-knows-what and **no one to blame** when things go wrong

### The Future

- AI will boost productivity by **empowering human workers**, to __understand more__ and to __build more__

### Project Goals

- Keep programming fun!
- Find ways to provide assurance of correctness for code made by AIs
- Find a tight loop of development involving people and AIs
- Find ways that programming with an AI can help the human learn and grow as an engineer

## The Misetay Way

**Step 1: Plan**

Break the project down into tasks -- with the AI's help.

Tasks are stored outside of the AI's context (by default, in the repo using Beads) so
that they are not lost.

<img alt="Screenshot of the user asking Misetay to plan a project" src="screenshots/planning-chat.png" width="400" />

**Step 2: Unleash**

Let the AI start work. Misetay will keep track of its progress. And don't worry about losing track of its changes
--- Misetay knows which changes go with which tasks, and you can review them easily later.

<img alt="Screenshot of the user telling Misetay to start work, and of the Task View showing all the tasks and their status" src="screenshots/task-view.png" width="750" />

**Step 3: Understand**

When you are ready to review some code, tell Misetay, and it will start a review session. Misetay
walks you through the changes for a particular task, opening files and highlighting lines, and giving you a change to comment or ask questions. All at _your_ pace!

<img alt="Screenshot of the user doing a code-review with Misetay" src="screenshots/review.png" width="850" />

**Step 4: Revise**

And, of course, you can ask for changes!
- Correct problems in a task's code changes
- Add new tasks
- Drop existing tasks

Misetay tracks all this for you.

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

### Task Backend

The default task backend is [Beads](https://github.com/steveyegge/beads), which is bundled with the extension. No separate installation is needed.
