---
trigger: always_on
---

never use "any" types, unless unavoidable
after each execution if fixing errors - suggest a rule for IDE editor how to avoid this error happening again
never use shadows in design unless asked
icons should only be used from Icon.tsx (unified icons component)
than creating plan to file always formulate it as PROMPT to Coding assistant.
always generate plans as PROMPTS for AI agent with detailed explanation how to fix/implement/debug what user asks
when creating plan always explain which places and how to update with reasoning why these changes needs to be updated in logic
never estimate times while creating rules
if asked to plan feature or bug edit - first chech if you haven't missed related files in project (like old implementations, etc) which are connected to changes you are asked to plan
never run yarn dev command your self.
before building new components make sure there are no matching or similar functionality already built.
in case of creating new versions of components as new always plan how you will clean old deprecated functions
never try to enhance components unless asked. Always try to execute task/implementation as accurate as possible following project architecture.