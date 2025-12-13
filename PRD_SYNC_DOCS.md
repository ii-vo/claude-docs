# Product Requirements Document
## sync-docs: Claude Code Research Workflow

**Version:** 2.0
**Date:** 2025-12-14
**Status:** Draft
**License:** Open Source (MIT)
**Supersedes:** MVP_PRD.md (deprecated)

---

## 1. Executive Summary

`sync-docs` is a Claude Code research workflow tool that automatically configures library-specific sub-agents powered by Context7. It scans project dependencies, validates documentation availability, and generates optimized research agents that provide accurate, up-to-date library context during development.

**Core value proposition:** Developers get specialized AI research assistants for every library in their project, pre-configured with the correct Context7 search patterns and library-specific knowledge.

---

## 2. Problem Statement

When developers use Claude Code for assistance:
- Claude's training data may be outdated for rapidly evolving libraries
- Generic prompts don't leverage library-specific documentation structure
- Manually configuring research workflows per-library is tedious
- No standardized way to ensure Claude checks official docs before answering

**Solution:** Automate the creation of library-aware research agents that always consult Context7 for current documentation.

---

## 3. Goals & Objectives

### Primary Goals
1. Auto-detect project libraries from manifest files
2. Validate each library's documentation availability via Context7
3. Generate optimized sub-agents with library-specific prompts
4. Provide both direct invocation (`@research-react`) and router (`/research`) patterns
5. Include base codebase research agents by default

### Success Metrics
- Sub-agents correctly invoke Context7 for their assigned library
- Documentation validation logs clearly show availability status
- Incremental sync adds new libraries without disrupting existing agents
- User modifications preserved via backup system

---

## 4. User Journey

### 4.1 First-Time Setup

```bash
# User runs npx in their project
npx sync-docs

# Output:
# ? Enter Context7 API Key (optional, press Enter to skip): ****
# ✓ API key saved to .env
# ✓ Created .claude/commands/sync-docs.md
# ✓ Created .claude/commands/research.md
#
# Next: Run /sync-docs in Claude Code to generate library agents
```

### 4.2 Agent Generation

```
User: /sync-docs

Claude:
Scanning project dependencies...
✓ Found package.json with 12 dependencies
✓ Found requirements.txt with 5 dependencies

Validating libraries with Context7...
✓ react (v18.2.0) - Found: 2,847 snippets, topics: hooks, components, api
✓ next (v15.0.0) - Found: 1,923 snippets, topics: app-router, pages, api-routes
✓ stripe - Found: 892 snippets, topics: payments, subscriptions, webhooks
✗ internal-utils - Not found in Context7 (skipping)
✓ langchain (Python) - Found: 1,456 snippets, topics: chains, agents, memory

Creating research agents...
✓ .claude/agents/research-react.md
✓ .claude/agents/research-next.md
✓ .claude/agents/research-stripe.md
✓ .claude/agents/research-langchain.md

Creating base agents...
✓ .claude/agents/codebase-locator.md
✓ .claude/agents/codebase-analyzer.md
✓ .claude/agents/codebase-pattern-finder.md

Updating /research router...
✓ Added 4 library agents to router

Setup complete! You can now use:
- @research-react "how do hooks work?"
- @research-stripe "webhook signature verification"
- /research next app router layouts
```

### 4.3 Daily Usage

**Direct invocation:**
```
User: @research-react explain the useEffect cleanup pattern

@research-react: [Queries Context7 for react hooks useEffect cleanup]
Based on the official React documentation...
```

**Router invocation:**
```
User: /research stripe subscription lifecycle

/research: [Routes to @research-stripe, which queries Context7]
According to Stripe's documentation...
```

### 4.4 Incremental Updates

```
User: /sync-docs

Claude:
Scanning dependencies...
✓ Found 2 new libraries since last sync

Validating new libraries...
✓ zod - Found: 234 snippets
✓ tanstack-query - Found: 567 snippets

Updating agents...
! Backed up research-react.md to research-react.md.bak (modified)
✓ Updated research-react.md with latest Context7 patterns
✓ Created research-zod.md
✓ Created research-tanstack-query.md

Sync complete! 2 new agents, 1 updated
```

---

## 5. Technical Architecture

### 5.1 Component Overview

```
sync-docs/
├── bin/
│   └── cli.js                    # npx entry point
├── templates/
│   ├── sync-docs.md              # /sync-docs slash command
│   ├── research.md               # /research router command
│   ├── base-agents/
│   │   ├── codebase-locator.md
│   │   ├── codebase-analyzer.md
│   │   └── codebase-pattern-finder.md
│   └── library-agent.md.hbs      # Handlebars template for lib agents
├── src/
│   └── index.ts                  # CLI logic
└── package.json
```

### 5.2 Generated File Structure

After running `npx sync-docs` and `/sync-docs`:

```
project/
├── .env                          # CONTEXT7_API_KEY (optional)
├── .claude/
│   ├── commands/
│   │   ├── sync-docs.md          # The sync command
│   │   └── research.md           # Router command
│   └── agents/
│       ├── codebase-locator.md   # Base agent
│       ├── codebase-analyzer.md  # Base agent
│       ├── codebase-pattern-finder.md # Base agent
│       ├── research-react.md     # Library agent
│       ├── research-next.md      # Library agent
│       └── research-stripe.md    # Library agent
└── package.json / requirements.txt
```

### 5.3 Library Detection

**Supported manifest files (Phase 1):**
- `package.json` - dependencies + devDependencies
- `requirements.txt` - Python packages

**Future phases:**
- `Cargo.toml` (Rust)
- `go.mod` (Go)
- `pom.xml` / `build.gradle` (Java)
- `Gemfile` (Ruby)

### 5.4 Context7 Integration Flow

For each detected library:

```
1. SEARCH: client.searchLibrary(packageName)
   → Returns: id, title, description, totalSnippets, versions

2. VALIDATE: Check if results exist and state === 'finalized'
   → Log: "✓ react - Found: 2,847 snippets" or "✗ foo - Not found"

3. PROBE CAPABILITIES: client.getDocs(libraryId, { mode: 'info', limit: 5 })
   → Extract: available topics, common patterns, API structure

4. GET VERSION (if applicable):
   → Read installed version from manifest
   → Pass to Context7 via version param (or prompt user)

5. GENERATE AGENT:
   → Use probed info to create optimized prompt
   → Include exact Context7 search patterns
   → Document available topics and capabilities
```

### 5.5 Critical: No Web Search for Documentation

**The /sync-docs command must ONLY use Context7 for documentation discovery.**

```
DO:
✓ Use Context7 searchLibrary() to find libraries
✓ Use Context7 getDocs() to probe capabilities
✓ Log clearly when a library is NOT found in Context7
✓ Skip agent creation for unfound libraries

DO NOT:
✗ Fall back to web search if Context7 doesn't have a library
✗ Use WebSearch or WebFetch to find documentation
✗ Scrape external documentation sites
✗ Guess at documentation structure without Context7 validation
```

**Rationale:** Web search results are unpredictable and may return outdated or unofficial docs. Context7 provides structured, validated documentation. If a library isn't in Context7, we skip it cleanly rather than creating an unreliable agent.

**User escape hatch:** The `@web-search-researcher` agent is available for manual research when Context7 doesn't have coverage. Users can ask it directly, but /sync-docs never invokes it automatically.

---

## 6. Agent Specifications

### 6.1 Library Research Agent Template

Each generated library agent follows this structure:

```markdown
---
name: research-{library}
description: Research specialist for {Library} documentation via Context7
tools: Context7
model: sonnet
---

# {Library} Documentation Research Agent

You are a documentation research specialist for **{Library}**.

## Your Knowledge Base (via Context7)

**Library ID:** `{context7_id}`
**Available Documentation:**
- Total Snippets: {total_snippets}
- Available Topics: {topics}
- Versions: {versions}

## CRITICAL: Documentation-First Protocol

1. **ALWAYS query Context7 FIRST** before answering any {Library} question
2. **NEVER rely on training data** for API methods, syntax, or behavior
3. **Use the exact search patterns** documented below

## Context7 Search Patterns

For general questions:
```typescript
context7.getDocs("{context7_id}", { mode: "code", limit: 10 })
```

For specific topics:
```typescript
context7.getDocs("{context7_id}", { mode: "code", topic: "{topic}", limit: 10 })
```

For conceptual/guide content:
```typescript
context7.getDocs("{context7_id}", { mode: "info", limit: 5 })
```

{version_section}

## Available Topics

{topics_list}

## Response Format

When answering questions:
1. State which Context7 query you're executing
2. Summarize relevant findings from the documentation
3. Provide code examples directly from the docs when applicable
4. Include the documentation source/snippet ID for reference

## What You DO NOT Do

- Guess at APIs or syntax
- Use outdated information from training data
- Provide advice without checking documentation first
- Make assumptions about library behavior

You are a conduit to official documentation, not a replacement for it.
```

### 6.2 /research Router Command

```markdown
---
description: Research any library in the project via specialized sub-agents
model: sonnet
---

# Research Router

You are a research coordinator that routes documentation questions to specialized library agents.

## Available Library Agents

{agent_list}
- @research-react - React documentation specialist
- @research-next - Next.js documentation specialist
- @research-stripe - Stripe documentation specialist
{/agent_list}

## Routing Logic

1. **Identify the library** from the user's question
2. **Delegate to the appropriate agent** using @mention
3. **If multiple libraries**, spawn parallel sub-agents
4. **If library not recognized**, inform user and suggest /sync-docs

## Usage Examples

User: "How do I handle webhooks in Stripe?"
→ Route to: @research-stripe

User: "Compare React Query vs SWR for data fetching"
→ Route to: @research-tanstack-query AND @research-swr (parallel)

User: "How does Next.js handle React Server Components?"
→ Route to: @research-next (includes React context)

## For Unknown Libraries

If a library isn't in the agent list:
1. Inform user: "I don't have a specialized agent for {library} yet"
2. Suggest: "Run /sync-docs to add new library agents"
3. Offer: "I can do a general web search instead if you'd like"
```

### 6.3 Base Agents

The following agents are always created by sync-docs:

**codebase-locator** - Finds WHERE code lives (files, directories, patterns)
**codebase-analyzer** - Explains HOW code works (implementation details, data flow)
**codebase-pattern-finder** - Shows EXAMPLES of patterns in the codebase
**web-search-researcher** - Finds information from web sources when Context7 doesn't have coverage

(Full prompts stored in `/templates/base-agents/` - these are documentarians, not critics)

---

## 7. Versioning Strategy

### 7.1 Library Version Handling

**Default behavior:**
1. Read installed version from package.json/requirements.txt
2. Check if Context7 has that version available
3. If yes, use version param in queries
4. If no, use latest and note version mismatch

**User prompt (if Claude Code supports it):**
```
Found next@15.0.3 installed
Context7 has versions: 15.0.0, 14.2.0, 14.1.0

Use:
1. Installed version (15.0.3) - closest match: 15.0.0
2. Latest available
3. Specific version: ___
```

### 7.2 Framework Variants (e.g., Next.js App vs Pages Router)

Single agent with smart prompt:
```markdown
## Framework Variants

Next.js supports multiple paradigms:
- **App Router** (Next.js 13+): Uses /app directory, Server Components default
- **Pages Router** (legacy): Uses /pages directory, Client Components default

When answering questions:
1. Ask user which router they're using if unclear
2. Check their project structure (/app vs /pages)
3. Provide variant-specific documentation
4. Note differences when relevant
```

---

## 8. Update & Overwrite Strategy

### 8.1 Incremental Sync

```
/sync-docs behavior:
1. Scan current manifests
2. Compare to existing agents in .claude/agents/research-*.md
3. For NEW libraries → Create agent
4. For EXISTING libraries → Check if update needed
5. For REMOVED libraries → Leave agent (user may want to keep)
```

### 8.2 Backup on Overwrite

```
If agent file has been modified (hash mismatch):
1. Copy current to {agent}.md.bak
2. Write new agent content
3. Log: "! Backed up research-react.md (modified by user)"
```

### 8.3 Force Reset

```
/sync-docs --force

Behavior:
1. Delete all .claude/agents/research-*.md files
2. Regenerate all from scratch
3. Does NOT touch base agents unless --force-all
```

---

## 9. Distribution

### 9.1 Package Name

```
npx sync-docs
```

### 9.2 Installation Scopes

**Project scope (default):**
```bash
npx sync-docs
# Creates .claude/ in current directory
```

**Global scope:**
```bash
npx sync-docs --global
# Creates in ~/.claude/ (user-level commands)
```

### 9.3 npm Package Structure

```json
{
  "name": "sync-docs",
  "version": "1.0.0",
  "bin": {
    "sync-docs": "./bin/cli.js"
  },
  "files": [
    "bin/",
    "templates/",
    "dist/"
  ]
}
```

---

## 10. CLI Interface

### 10.1 npx sync-docs

```
Usage: sync-docs [options]

Options:
  --global, -g     Install to ~/.claude/ instead of project
  --skip-key       Skip API key prompt
  --help, -h       Show help

Interactive prompts:
  1. API Key (optional, stored in .env)

Output:
  - .claude/commands/sync-docs.md
  - .claude/commands/research.md
```

### 10.2 /sync-docs (Claude Code)

```
Usage: /sync-docs [options]

Options:
  --force          Regenerate all library agents
  --force-all      Regenerate all agents including base agents
  --add <lib>      Add single library without full scan
  --remove <lib>   Remove a library agent

Examples:
  /sync-docs                    # Incremental sync
  /sync-docs --force            # Full regeneration
  /sync-docs --add lodash       # Add single library
```

---

## 11. Error Handling

### 11.1 Context7 Errors

```
Library not found:
  ✗ internal-utils - Not found in Context7
  → Skip agent creation, log to user

Rate limited:
  ⚠ Rate limit reached. Processed 8/12 libraries.
  → Save progress, suggest retry with API key

API error:
  ✗ Context7 error: {message}
  → Log error, continue with other libraries
```

### 11.2 Manifest Errors

```
No manifests found:
  ⚠ No package.json or requirements.txt found
  → Prompt: "Which libraries should I create agents for?"

Parse error:
  ✗ Could not parse package.json: {error}
  → Log error, skip file
```

---

## 12. Future Phases

### Phase 2: Enhanced Detection
- Cargo.toml, go.mod, pom.xml support
- Monorepo support (scan all packages)
- Import analysis (detect actually used libraries)

### Phase 3: Agent Intelligence
- Auto-detect framework variants from code
- Learning from user corrections
- Shared team configurations

### Phase 4: Distribution
- Homebrew formula
- VS Code extension
- JetBrains plugin

---

## 13. Development Phases

### Phase 1: MVP (Current Focus)

**CLI Scaffolding:**
- [x] Design PRD
- [ ] npx entry point (`bin/cli.js`)
- [ ] API key prompt (optional)
- [ ] Write `.claude/commands/sync-docs.md`
- [ ] Write `.claude/commands/research.md`

**Templates:**
- [ ] `/sync-docs` slash command template
- [ ] `/research` router template
- [ ] `codebase-locator.md` agent
- [ ] `codebase-analyzer.md` agent
- [ ] `codebase-pattern-finder.md` agent
- [ ] `web-search-researcher.md` agent
- [ ] `research-{library}.md` template (Handlebars)

**Slash Command Logic (/sync-docs):**
- [ ] Read package.json dependencies
- [ ] Read requirements.txt packages
- [ ] For each library: `searchLibrary()` → validate
- [ ] For each found library: `getDocs()` → probe capabilities
- [ ] Generate library agent from template
- [ ] Write to `.claude/agents/research-{lib}.md`
- [ ] Update `/research` router with agent list
- [ ] Incremental: detect existing agents, backup if modified
- [ ] Clear logging: ✓ found, ✗ not found

**Documentation:**
- [ ] README.md with usage
- [ ] CONTRIBUTING.md
- [ ] Example project in `/examples`

### Phase 2: Polish (Post-MVP)
- [ ] `--force` flag for full regeneration
- [ ] `--add <lib>` for single library
- [ ] Version handling (read from manifest)
- [ ] Better error messages
- [ ] Progress indicators during sync

### Phase 3: Distribution (Post-MVP)
- [ ] npm publish as `sync-docs`
- [ ] GitHub repository setup
- [ ] Documentation site (optional)
- [ ] Demo video

---

## 14. Deprecated

The following from MVP_PRD.md are deprecated:
- `npm run search` CLI command
- `npm run get-docs` CLI command
- Static markdown output to `output/` directory
- Mock SDK implementation
- All documentation files referring to the old CLI approach

---

## 15. Risks & Mitigations

### 15.1 Claude Code Beta Instability

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| MCP config location changes | High | Medium | We write to `.claude/commands/` and `.claude/agents/` (markdown files), not MCP config. Our core doesn't depend on MCP internals. |
| Sub-agent API changes | Medium | High | Agents are markdown files with prompts. If Claude Code changes agent format, we update templates. |
| Claude Code sunsets | Low | Critical | Core value is in the prompt templates. Can adapt to other AI coding tools. |

**Key insight:** Our tool generates **markdown files**, not MCP configurations. The npx scaffolding + slash command templates work independently of Claude Code's MCP subsystem instability.

**Graceful degradation:** If Claude Code changes break agent discovery:
1. Agents still work as regular markdown files users can reference
2. Provide manual setup instructions as fallback
3. Document workarounds in README

### 15.2 Context7 Dependencies

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Rate limits hit | Medium | Medium | Optional API key upgrades limits. Graceful degradation: process what we can, log skipped libraries. |
| Library not in Context7 | High | Low | Clearly log "✗ {lib} - Not found", skip agent creation. Suggest `--add <lib> --url <docs>` for manual. |
| Version mismatch | Medium | Low | Use closest available version, note mismatch in agent prompt. |
| Context7 API changes | Low | High | Pin SDK version, subscribe to releases. |

**Coverage reality:** Many niche/internal libraries won't be in Context7. This is expected and clearly communicated to users during sync.

### 15.3 Scope Creep

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Feature requests overwhelm MVP | High | High | MVP is ruthlessly scoped (see 16.1). Say "no" clearly. |
| Multi-language support delays launch | Medium | Medium | Phase 1 is package.json + requirements.txt only. Period. |

---

## 16. MVP Scope Definition

### 16.1 What's IN the MVP

**Absolutely required for v1.0.0:**
- `npx sync-docs` CLI that scaffolds `.claude/commands/` and `.claude/agents/`
- `/sync-docs` slash command template
- `/research` router template
- 4 base agents (codebase-locator, codebase-analyzer, codebase-pattern-finder, web-search-researcher)
- `package.json` dependency detection
- `requirements.txt` dependency detection
- Context7-only library validation (NO web search fallback)
- Library agent generation from template
- Clear logging of found/not-found libraries
- Incremental sync (don't overwrite existing agents unless changed)
- Backup `.bak` files for modified agents

**That's it. Ship this.**

### 16.2 What's NOT in MVP (Phase 2+)

Explicitly deferred:
- ❌ Cargo.toml, go.mod, pom.xml support
- ❌ Monorepo/workspace scanning
- ❌ Version selection prompts
- ❌ `--add <lib> --url <docs>` for custom libraries
- ❌ Framework variant auto-detection
- ❌ Team/shared configurations
- ❌ Homebrew formula
- ❌ VS Code extension
- ❌ Context7 result caching
- ❌ Diagnostic command (`/diagnose-sync-docs`)

### 16.3 MVP Success Criteria

v1.0.0 ships when:
1. [ ] `npx sync-docs` works in a fresh project
2. [ ] Running `/sync-docs` in Claude Code generates agents
3. [ ] `@research-react` correctly queries Context7 for React docs
4. [ ] `/research stripe webhooks` routes to `@research-stripe`
5. [ ] Libraries not in Context7 are logged clearly (not silent failures)
6. [ ] Re-running `/sync-docs` doesn't destroy user modifications
7. [ ] README has clear usage instructions

---

## 17. Open Questions

1. **Agent file format:** Should we use `.md` or `.yaml` for agent definitions?
2. **Context7 caching:** Should agents cache Context7 results to reduce API calls?
3. **Private libraries:** How to handle internal/private npm packages?
4. **Monorepo support:** Scan root only or all workspace packages?

---

## 18. Contributing

This is an open source project. Contributions welcome:

1. **Issues:** Report bugs or suggest features on GitHub
2. **PRs:** Follow conventional commits, include tests for new features
3. **Templates:** Improve agent prompts via PR to `/templates/`
4. **Documentation:** Help improve README and usage guides

---

**Document Owner:** @ia
**Last Updated:** 2025-12-14
**Next Review:** After MVP implementation
**Repository:** TBD (will be published to GitHub)
