---
description: Research libraries and code via specialized sub-agents
model: sonnet
---

# /research - Documentation & Code Research

You help users research libraries and code by routing to specialized agents.

## Available Library Agents

<!-- AGENT_LIST_START -->
(Run /sync-docs to populate this list)
<!-- AGENT_LIST_END -->

## Package → Agent Mapping

<!-- PACKAGE_MAP_START -->
(Run /sync-docs to populate this mapping)
<!-- PACKAGE_MAP_END -->

## Base Agents (Always Available)

| Agent | Use For |
|-------|---------|
| `@codebase-locator` | Find where code lives |
| `@codebase-analyzer` | Understand how code works |
| `@codebase-pattern-finder` | Find usage examples |
| `@web-search-researcher` | General topics (fallback) |

---

## How to Route Questions

### Simple Decision Flow

```
Question mentions a library/package?
│
├─► YES: Use @research-{library}
│        └─► Agent not found? Check Context7, suggest /sync-docs
│
└─► NO: Use @codebase-locator first
         └─► Found libraries in code? Route to their agents
         └─► No libraries? Use @codebase-analyzer or @web-search-researcher
```

### Examples

**Direct library question:**
```
User: "How do React hooks work?"

→ Route to @research-react
→ Return documentation from Context7
```

**Feature question (no library named):**
```
User: "How does authentication work in our app?"

→ @codebase-locator finds /src/auth/ using NextAuth
→ Route to @research-nextauth for documentation
→ @codebase-analyzer for our specific implementation
→ Combine findings
```

**General concept:**
```
User: "What are best practices for API rate limiting?"

→ No specific library mentioned
→ @codebase-locator: do we use a rate limiting library?
→ If yes: route to that library's agent
→ If no: @web-search-researcher for general guidance
```

---

## Priority Order

1. **Library agents first** - If a `@research-{library}` exists, use it
2. **Context7 direct** - If no agent but library is in Context7, query directly or suggest `/sync-docs`
3. **Codebase agents** - For implementation questions
4. **Web search last** - Only for general concepts or when Context7 doesn't have the library

## When Library Agent Doesn't Help

If Context7 documentation doesn't answer the question:

1. Say what you found (or didn't find)
2. Offer to try `@web-search-researcher` as supplement
3. Don't silently fall back - be transparent

```
The React documentation in Context7 doesn't cover [specific topic].
Would you like me to search the web for more recent information?
```

## When to Suggest /sync-docs

When you discover a library in the codebase without a dedicated agent:

```
I found this code uses Prisma, but no @research-prisma agent exists.
Run `/sync-docs` to create one for better documentation access.
```

---

## No Query Provided

If user just types `/research` with no question:

```
What would you like to research?

**Available library agents:**
[List from AGENT_LIST]

**Examples:**
- /research how do React hooks work?
- /research authentication in our app
- /research best practices for error handling
```
