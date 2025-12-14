---
name: library-research
description: "Auto-activates for library/framework questions. Routes to @research-{library} agents for official documentation via Context7."
---

# Library Research Skill

This skill auto-activates when users ask about libraries, frameworks, or packages.

## When This Activates

- Questions about library APIs, methods, or behavior
- "How do I use [library] to..."
- Debugging library-specific issues
- Looking for library code examples

## What To Do

1. **Check if `@research-{library}` agent exists**
2. **If yes** → Route to that agent
3. **If no** → Check Context7 via `resolve-library-id`, suggest `/sync-docs` if found
4. **If not in Context7** → Offer `@web-search-researcher` as fallback

## Available Library Agents

<!-- SKILL_AGENT_LIST_START -->
(Run /sync-docs to populate)
<!-- SKILL_AGENT_LIST_END -->

## Package Mapping

<!-- SKILL_PACKAGE_MAP_START -->
(Run /sync-docs to populate)
<!-- SKILL_PACKAGE_MAP_END -->

## Priority

1. Library-specific agents (@research-react, etc.)
2. Context7 direct query
3. Web search (only if library not in Context7)

## Note

For explicit research requests, users can also use `/research <query>`.
