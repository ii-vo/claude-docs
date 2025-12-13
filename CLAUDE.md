# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**sync-docs** - A Claude Code research workflow tool that auto-configures library-specific sub-agents via Context7. Scans project dependencies, validates documentation availability, and generates optimized research agents.

**Status:** In development (see PRD_SYNC_DOCS.md and IMPLEMENTATION_PLAN.md)

## Commands

```bash
# Current (legacy CLI - being deprecated)
npm run dev -- search "query"     # Search library docs
npm run dev -- get-docs "id"      # Get specific docs
npm run typecheck                 # Type check
npm run build                     # Compile to dist/

# Target (sync-docs MVP)
npx sync-docs                     # Scaffold .claude/ directory
# Then in Claude Code: /sync-docs to generate library agents
```

No test or lint commands configured.

## Architecture

### Current State (Legacy)

```
src/
├── index.ts                 # CLI entry (Commander.js)
├── commands/
│   ├── search-library.ts    # Search command (deprecated)
│   ├── get-docs.ts          # Get docs command (deprecated)
│   └── shared.ts            # Shared command logic
├── lib/
│   └── context7-sdk.ts      # Context7 SDK wrapper
├── utils/
│   ├── file-operations.ts   # Markdown formatting, file I/O
│   └── prompt.ts            # User prompts
└── config/
    └── context7-config.ts   # Environment config
```

### Target State (sync-docs)

```
sync-docs/
├── bin/cli.js               # npx entry point
├── src/index.ts             # CLI logic
├── templates/
│   ├── commands/
│   │   ├── sync-docs.md     # /sync-docs slash command
│   │   └── research.md      # /research router
│   └── agents/              # Base agent templates
└── package.json
```

### Key Files

- `PRD_SYNC_DOCS.md` - Full product requirements
- `IMPLEMENTATION_PLAN.md` - Phased task breakdown
- `templates/*.md` - Base agent prompts (codebase-locator, codebase-analyzer, codebase-pattern-finder, web-search-researcher)
- `src/lib/context7-sdk.ts` - Context7 SDK wrapper (reusable)

## Technology

- TypeScript 5.6, ES2022 target, ESNext modules
- Node.js 22+ required
- Dependencies: commander, prompts, dotenv, @upstash/context7-sdk
- Dev: tsx for execution

## Environment

```bash
# .env
CONTEXT7_API_KEY=your_key      # Optional, increases rate limits
OUTPUT_DIR=./output            # Legacy CLI only
```

## Context7 SDK Usage

```typescript
import { Context7 } from '@upstash/context7-sdk';

const client = new Context7({ apiKey: process.env.CONTEXT7_API_KEY });

// Search for library
const results = await client.searchLibrary("react");

// Get documentation
const docs = await client.getDocs("/facebook/react", {
  mode: "code",    // or "info"
  format: "json",  // or "txt"
  limit: 10,
  topic: "hooks"   // optional filter
});
```

## Critical Constraints

When implementing /sync-docs:
- **Context7 ONLY** for documentation lookup - no WebSearch/WebFetch fallback
- If library not in Context7, skip and log clearly
- Incremental sync: backup modified agents to `.bak` before overwriting
