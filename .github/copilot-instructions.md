# Instructions for Coding Agents

This is Misatay. See [README.md](../README.md) for a description of the project.

Before committing any work to Git, run the tests with `npm run test`. Do not commit
if there are any failures!

When making changes, look for places that can be tested with unit tests, and make
unit tests as appropriate.

This project uses [OpenSpec specs](../openspec) to document requirements. Treat them
as the source of truth about how Misatay should behave.

IMPORTANT: Do NOT make tests that are stupid! They need to test real code -- not mock code!

NOTE: Misatay is *NOT* a chat participant! It is a [custom agent](https://code.visualstudio.com/docs/copilot/customization/custom-agents)!

When the user asks you to make code changes, make sure that the requested
changes agree with the OpenSpec specs. If they don't, tell the user and
ask what to do.