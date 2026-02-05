# Smidja - AI Agent Tool that Keeps You in the Loop

When you build software with Smidja, you are __involved__ and __in charge__. 

When Smidja says "All done!", you actually believe it! You're ready to:
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
- **Beatrice** (`dshearer.beatrice`): Provides file navigation tools for code review
  - Install from VS Code Marketplace: [Beatrice](https://marketplace.visualstudio.com/items?itemName=dshearer.beatrice)

### Required Tools

- **Task Backend** (default: [Beads](https://beads.dev))
  - Install Beads CLI: `brew install beads` (or via npm/go)
  - Alternative backends: Linear, GitHub Issues, JIRA, etc.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
