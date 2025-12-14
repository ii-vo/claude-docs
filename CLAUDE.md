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
│   ├── agents/            # Base agent templates
│   └── skills/            # Skill templates
│       └── library-research/SKILL.md
├── package.json
└── docs/                  # Planning documents (PRD, implementation plan)
```

## How It Works

1. User runs `npx claude-docs` in their project
2. CLI configures Context7 MCP server via `claude mcp add`
3. CLI copies templates to `.claude/commands/`, `.claude/agents/`, and `.claude/skills/`
4. User runs `/sync-docs` in Claude Code to generate library-specific agents

## Routing Flow

```
Question mentions a library?
├─► YES: Use @research-{library}
│        └─► No agent? Check Context7, suggest /sync-docs
└─► NO:  Use @codebase-locator first
         └─► Found libraries? Route to their agents
         └─► No libraries? Use codebase agents or web search
```

## Key Design Decisions

- **Library agents first** - Always prefer `@research-{library}` for library questions
- **Context7 as source** - Library agents use Context7 MCP for documentation
- **Web search as fallback** - Only for general topics or libraries not in Context7
- **Skill for auto-routing** - `library-research` skill auto-triggers for library questions
- **Graceful degradation** - If Context7 doesn't help, offer web search transparently
