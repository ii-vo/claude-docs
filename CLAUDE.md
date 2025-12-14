# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**claude-docs** - Claude Code research workflow tool that auto-configures library-specific sub-agents via Context7.

## Commands

```bash
npm install          # Install dependencies
npm run build        # Compile TypeScript to dist/
npm run dev          # Run with tsx (development)
npm run typecheck    # Type check without emitting
```

## Project Structure

```
claude-docs/
├── src/index.ts           # CLI source
├── dist/index.js          # Compiled CLI (has shebang)
├── templates/
│   ├── commands/          # Slash command templates
│   │   ├── sync-docs.md   # /sync-docs command
│   │   └── research.md    # /research router
│   └── agents/            # Base agent templates
├── package.json
└── docs/                  # Planning documents (PRD, implementation plan)
```

## How It Works

1. User runs `npx claude-docs` in their project
2. CLI configures Context7 MCP server via `claude mcp add`
3. CLI copies templates to `.claude/commands/` and `.claude/agents/`
4. User runs `/sync-docs` in Claude Code to generate library-specific agents

## Critical Constraints

- **Context7 ONLY** for documentation lookup - no WebSearch/WebFetch fallback
- If library not in Context7, skip and log clearly
- Incremental sync: backup modified agents to `.bak` before overwriting
