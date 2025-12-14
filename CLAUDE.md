# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**claude-docs** - A Claude Code research workflow tool that auto-configures library-specific sub-agents via Context7. Scans project dependencies, validates documentation availability, and generates optimized research agents.

**npm package:** `claude-docs`
**CLI command:** `claude-docs` or `npx claude-docs`
**Slash command:** `/sync-docs` (runs inside Claude Code)

## Quick Start

```bash
# From the sync-docs/ directory
cd sync-docs
npm install
npm run build
npm link

# Test in any project
cd /path/to/your-project
claude-docs              # Scaffolds .claude/ and configures Context7 MCP
# Then in Claude Code:
/sync-docs               # Generates library agents from dependencies
```

## Repository Structure

```
claude-docs/                     # Repository root
├── sync-docs/                   # Main package (npm: claude-docs)
│   ├── dist/index.js            # Compiled CLI (has shebang)
│   ├── src/index.ts             # CLI source
│   ├── templates/
│   │   ├── commands/
│   │   │   ├── sync-docs.md     # /sync-docs slash command
│   │   │   └── research.md      # /research router
│   │   └── agents/              # Base agent templates
│   ├── package.json             # name: "claude-docs"
│   └── README.md                # User-facing documentation
├── PRD_SYNC_DOCS.md             # Product requirements
├── IMPLEMENTATION_PLAN.md       # Implementation checklist
└── CLAUDE.md                    # This file
```

### Legacy Code (root level, being deprecated)

The root-level `src/`, `dist/`, and `package.json` contain a deprecated CLI approach. The active code is in `sync-docs/`.

## CLI Options

```
Usage: claude-docs [options]

Options:
  -V, --version   output the version number
  -g, --global    Install to ~/.claude/ instead of project
  --skip-mcp      Skip Context7 MCP configuration
  -h, --help      display help for command
```

## Development Commands

```bash
# In sync-docs/ directory
npm run build        # Compile TypeScript to dist/
npm run dev          # Run with tsx (development)
npm run typecheck    # Type check without emitting
```

## Technology

- TypeScript 5.6, ES2022 target, ESNext modules
- Node.js 22+ required
- Dependencies: commander, prompts, dotenv
- Dev: tsx for execution

## Critical Constraints

When implementing /sync-docs:
- **Context7 ONLY** for documentation lookup - no WebSearch/WebFetch fallback
- If library not in Context7, skip and log clearly
- Incremental sync: backup modified agents to `.bak` before overwriting
