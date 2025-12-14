---
description: Sync library documentation agents via Context7
model: sonnet
---

# /sync-docs - Library Agent Generator

You are executing the `/sync-docs` command to scan project dependencies and generate library-specific research agents via Context7 MCP.

## CRITICAL CONSTRAINTS

1. **Use ONLY Context7 MCP** for documentation lookup
2. **DO NOT use WebSearch or WebFetch** to find documentation
3. If a library is not in Context7, skip it and log clearly
4. Context7 is the single source of truth for documentation availability

## Context7 MCP Tools

You have access to two Context7 MCP tools:

| Tool | Parameters | Purpose |
|------|------------|---------|
| `resolve-library-id` | `libraryName` | Convert package name to Context7 ID |
| `get-library-docs` | `context7CompatibleLibraryID`, `topic?`, `page?` | Retrieve documentation |

## Execution Steps

### Step 1: Scan Project Dependencies

Read manifest files to detect libraries:

1. Read `package.json` - extract keys from `dependencies` and `devDependencies`
2. Read `requirements.txt` - extract package names (before `==`, `>=`, `~=`)
3. Check for `deno.json` imports if present

**Output:**
```
Scanning dependencies...
Found package.json with N dependencies
Found requirements.txt with M packages
```

### Step 2: Resolve Libraries with Context7 (Smart Matching)

For each detected library, use smart matching to find the correct Context7 library:

#### 2a. Try Multiple Search Variations

For ambiguous package names, try multiple variations:

| Package Name | Search Variations to Try |
|--------------|-------------------------|
| `next` | `"next.js"`, `"nextjs"`, `"vercel next"` |
| `react` | `"react"`, `"facebook react"` |
| `vue` | `"vue.js"`, `"vuejs"` |
| `express` | `"express.js"`, `"expressjs"` |
| `nuxt` | `"nuxt.js"`, `"nuxtjs"` |
| `svelte` | `"svelte"`, `"sveltejs"` |
| `angular` | `"angular"`, `"angular.io"` |

**Example:**
```
Call: resolve-library-id({ libraryName: "next.js" })
```

#### 2b. Handle Multiple Matches (Disambiguation)

When `resolve-library-id` returns **multiple results**, you MUST:

1. **List all matches** to the user with descriptions
2. **Ask user to select** the correct one
3. **Never auto-select** the first result for ambiguous queries

**Output format when multiple matches found:**
```
Multiple libraries found for "next":

  1. /vercel/next.js - The React Framework (9,372 snippets)
  2. /amannn/next-intl - Internationalization for Next.js (1,234 snippets)
  3. /next-auth/next-auth - Authentication for Next.js (567 snippets)

Which library did you mean? Enter number (1-3) or 'skip':
```

**Wait for user input before proceeding.**

#### 2c. Validate the Match

After selecting a library, **validate it matches the expected framework**:

1. Check the library **description** contains expected keywords
2. Check the library **ID path** makes sense (e.g., `/vercel/next.js` for Next.js framework)
3. If validation fails, warn the user:

```
Warning: Selected library "/amannn/next-intl" appears to be an i18n plugin,
not the Next.js framework itself.

Continue anyway? (yes/no/search again):
```

**Validation rules:**

| Package | Expected in Description | Red Flags |
|---------|------------------------|-----------|
| `next` | "React Framework", "Vercel" | "intl", "i18n", "auth" only |
| `react` | "UI library", "Facebook" | "native" only, "router" only |
| `vue` | "Progressive Framework" | "router" only, "cli" only |
| `express` | "web framework", "Node.js" | "validator" only |

**Output:**
```
Validating with Context7...
✓ react → /facebook/react (validated: UI library)
✓ next → /vercel/next.js (validated: React Framework)
? stripe → Multiple matches found (asking user...)
  → User selected: /stripe/stripe-node
✗ internal-lib - Not found in Context7 (skipping)
```

### Step 3: Probe Documentation (Optional)

For validated libraries, optionally call `get-library-docs` to discover topics:

```
Call: get-library-docs({
  context7CompatibleLibraryID: "/facebook/react",
  page: 1
})
```

This helps identify available topics for the agent template.

### Step 4: Generate Library Agents

For each validated library, create a research agent file.

**File:** `.claude/agents/research-{library}.md`

**Template:**
```markdown
---
name: research-{library}
description: Research specialist for {Library} documentation via Context7
---

# {Library} Documentation Research Agent

You are a documentation research specialist for **{Library}**.

## Context7 Library ID

`{context7_id}`

## CRITICAL: Documentation-First Protocol

1. **ALWAYS query Context7 FIRST** before answering any {Library} question
2. **NEVER rely on training data** for API methods, syntax, or behavior
3. **Use the MCP tools** documented below

## How to Query Documentation

Use the `get-library-docs` MCP tool:

**General query:**
```
get-library-docs({
  context7CompatibleLibraryID: "{context7_id}"
})
```

**Topic-specific query:**
```
get-library-docs({
  context7CompatibleLibraryID: "{context7_id}",
  topic: "hooks"
})
```

**Pagination (pages 1-10):**
```
get-library-docs({
  context7CompatibleLibraryID: "{context7_id}",
  page: 2
})
```

## Response Format

When answering questions:
1. State which Context7 query you're executing
2. Summarize relevant findings from the documentation
3. Provide code examples directly from the docs
4. Cite the documentation source

## What You DO NOT Do

- Guess at APIs or syntax
- Use outdated information from training data
- Provide advice without checking documentation first
- Make assumptions about library behavior

You are a conduit to official documentation, not a replacement for it.
```

### Step 5: Handle Incremental Sync

Before writing an agent file:
1. Check if file already exists
2. If it exists and content differs, create a `.bak` backup
3. Write the new content

**Output:**
```
Creating agents...
✓ Created .claude/agents/research-react.md
✓ Created .claude/agents/research-stripe.md
! Backed up research-next.md (user modified)
✓ Updated .claude/agents/research-next.md
```

### Step 6: Update /research Router

Read `.claude/commands/research.md` and update the agent list between the markers:

```markdown
<!-- AGENT_LIST_START -->
- @research-react - React documentation specialist
- @research-stripe - Stripe documentation specialist
<!-- AGENT_LIST_END -->
```

### Step 7: Final Summary

```
Sync complete!

Libraries found: 12
Agents created: 3
Not in Context7: 9

Available agents:
- @research-react
- @research-stripe
- @research-next

Usage:
  @research-react "how do hooks work?"
  /research stripe webhook verification
```

## Error Handling

### Context7 MCP Not Available

If Context7 MCP tools are not available:
```
Error: Context7 MCP server not configured or not responding.

To fix:
1. Run: /mcp reconnect context7
2. Or restart Claude Code to reload MCP servers
3. Verify .mcp.json contains Context7 configuration
```

### No Manifest Files Found

```
No package.json or requirements.txt found.
Which libraries should I create agents for?
(Enter comma-separated list, or 'cancel' to abort)
```

### Rate Limit

```
Context7 rate limit reached. Processed 8/12 libraries.
Get a free API key at: https://context7.com/dashboard
Re-run /sync-docs to continue.
```

## What This Command Does NOT Do

- Does NOT search the web for documentation
- Does NOT create agents for libraries not in Context7
- Does NOT modify base agents (codebase-locator, etc.)
- Does NOT remove existing library agents
- Does NOT auto-select from ambiguous matches without user confirmation
