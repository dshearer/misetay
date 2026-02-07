# Misatay - AI Agent Tool that Keeps You in the Loop

Misatay is a VS Code extension for working with AI agents. 
When you build software with Misatay, you are __involved__ and __in charge__.

(NOTE: It only works with GitHub Copilot.)

When Misatay says "All done!", you actually believe it! You're ready to:
- __Slam that merge button__, or
- Pester your colleagues for PR approvals without shame, or
- Deploy, then close your laptop and have a drink

Because: You've already reviewed the code! You were there from the beginning!

Your new dev loop:
- Plan a feature with Misatay, then _save your plan to your repo_ → **Lose nothing when you switch AI session**
- Let Misatay work on the plan's tasks and _commit its changes to Git_ → **Keep track of what changes go to what task**
- AI-guided code reviews → **Misatay tells you what changed and why, in the context of a task**
- Misatay asks for help instead of spinning on problems → **Save $$$ by wasting fewer tokens**

Jump to [The Misatay Way](#the-misatay-way) for details!

## Installation

It's a VS Code extension. So install it from the marketplace.

In repos where you haven't used Misatay, you have to initialize it. Open the command palette (Cmd-Shift-P) and choose "Misatay: Install Agent". This will add an agent prompt and some skills
to your repo. (I hope to avoid this step in the future, by keep these files in the extension and
out of your repo.)

## Recommended Settings

To get the best experience with Misatay, we recommend configuring the following VS Code setting:

### Auto Accept Delay

**Setting**: `copilot.agent.autoAcceptDelay`  
**Recommended value**: Greater than 0 (e.g., 5-10 seconds)

This setting controls the delay (in seconds) after which changes made by the AI agent are automatically accepted. Setting this to 0 means auto-accept is disabled, which means you need to manually accept every change.

We recommend setting this to a value greater than 0 to allow Misatay to work more efficiently. This gives you time to review changes while they're being made, but automatically accepts them after the delay if you don't intervene.

To configure this setting:
1. Open VS Code Settings (Cmd+, or Ctrl+,)
2. Search for "copilot.agent.autoAcceptDelay"
3. Set the value to your preferred delay (e.g., 5)

## Project Status

This is an _experiment_, although I do try to make Misatay useful for real work.

I am interested in finding ways to use AI in software development that _keep the engineer in the driver's seat_. Do you have ideas? **Open an issue!**

This brings us to the project's Manifesto:

## Manifesto

### Vision

- To make the best use of AI, AIs and people need to work side-by-side.
- AI will boost productivity by **empowering human workers**, to __understand more__ and to __build more__

### Project Goals

- Keep programming fun!
- Find ways to provide assurance of correctness for code made by AIs
- Find a tight loop of development involving people and AIs
- Find ways that programming with an AI can help the human learn and grow as an engineer

## The Misatay Way

_Before you start:_ You should think of Misatay as a pair-programmer that you've tasked with implementing
a feature. Misatay will take a crack at all the tasks for this feature, but sooner or later you will 
step in and review its code.

Note that, like a human engineer, Misatay commits its changes to Git as it goes. So it is best to give it
a feature branch to work on.

**Step 1: Plan**

First, open the Copilot Chat view in VS Code; then select Misatay as your agent.

<img alt="Screenshot of Misatay selected as the agent in Copilot Chat" src="screenshots/select-misatay.png" width="650" />

Now, break the project down into tasks — with the AI's help.

Tasks are stored outside of the AI's context (by default, in the repo using [Beads](https://github.com/steveyegge/beads)) so they are not lost.

<img alt="Screenshot of the user asking Misatay to plan a project" src="screenshots/planning-chat.png" width="750" />

**Step 2: Unleash**

Let the AI start work. Misatay will keep track of its progress, by updating tasks and committing its changes
to Git. And don't worry about losing track of its changes — Misatay knows which changes go with which tasks, and you can review them easily later.

<img alt="Screenshot of the user telling Misatay to start work, and of the Task View showing all the tasks and their status" src="screenshots/task-view.png" width="750" />

(You can open the Task view by choosing "Misatay: Show Task Status" from the command palette (Cmd-Shift-P).)

**Step 3: Understand**

When you are ready to review some code, tell Misatay, and it will start a review session. Misatay
walks you through the changes for a particular task, opening files and highlighting lines, and giving you a chance to comment or ask questions. All at _your_ pace!

<img alt="Screenshot of the user doing a code-review with Misatay" src="screenshots/review.png" width="750" />

<br/>

**Step 4: Revise**

And, of course, you can ask for changes!
- Correct problems in a task's code changes
- Add new tasks
- Drop existing tasks

Misatay tracks all this for you.

**Step ???: The AI Needs Help!**

Very often, AI agents will get stuck trying to fix something and just spin — wasting tokens and money. 

Not with Misatay! Misatay tells your agents to ask for help when they need it, using a special "needs help" task status to track this.

<img alt="Screenshot of a task with 'needs help' status" src="screenshots/needs-help.png" width="750" />

## Comparison

### Plain VS Code with Copilot

The diff-based review experience provided in VS Code's Copilot Chat is _excellent_ — but it doesn't scale to big projects.
If, for example, you tell Copilot "Go make me a Minecraft" (and you've pre-approved all the tools it needs), then let it run
for an hour, you'll come back to a pile of new code that you won't want to review.

Misatay, in contrast, helps you break the project into tasks. You can then tell it to go to work, and it will work on those
tasks _while remembering what changes belong to what tasks_ (using Git, of course). When you come back, you can review the completed
tasks one by one, in whatever order you want.

### Agents Galore

The extreme opposite of Misatay is [Gastown](https://steve-yegge.medium.com/welcome-to-gas-town-4f25ee16dd04), a very interesting experiment!
With agentic development, you unleash multiple (perhaps very many!) AI sessions on a project, and use some kind of harness to try to get them
to do something productive. The advantage of this is clear: When it works, you end up with the software you wanted without any person having to
write a line of it.

The disadvantages are also clear:
- **No person wrote a line of it**
- **It's very inefficient (and hence expensive).** For instance, AI agents tend to spend a lot of time and tokens screwing around in dead-ends; that's why
people came up with [Ralph](https://github.com/snarktank/ralph) and other such harnesses. They also need to spend tokens reviewing the basics of 
the project each time their context runs out.

### Old-Fashioned Hand-Coding

Misatay is, in fact, closer to hand-coding than to Gastown. Misatay has a disadvantage that keeps it from being a clear winner over hand-coding:
inference slowness. It takes minutes for any AI model to do a significant code change. What's the user supposed to do while waiting? This is
where the temptation to deploy fleets of agents comes from.

But imagine that it takes your AI one second to "Build the authentication module with unit tests", rather than one minute. If we had this kind of
performance — if the user did not have to wait very long for the AI — then I think that the Misatay approach to AI coding would be quite
competitive with hand-coding and agent fleets.

Sadly, we don't have this yet. But perhaps in the near future?

## Requirements

### Required Extensions

**GitHub Copilot**: Provides the AI agent and code generation capabilities

### Task Backend

The default task backend is [Beads](https://github.com/steveyegge/beads), which is bundled with the extension. No separate installation is needed.
