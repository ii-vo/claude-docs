# claude-docs

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/claude-docs.svg)](https://www.npmjs.com/package/claude-docs)

Claude Code research workflow tool that auto-configures library-specific sub-agents via [Context7](https://context7.com).

**Requirements:** [Claude Code](https://claude.ai/code) CLI installed (`npm install -g @anthropic-ai/claude-code`)

## Quick Start

```bash
# 1. Run setup (auto-configures Context7 MCP)
npx claude-docs

# 2. In Claude Code, generate library agents
/sync-docs

# 3. Research any library
@research-react "explain useState hooks"
```

## What It Does

`claude-docs` sets up your project for AI-powered documentation research:

1. **Configures** Context7 MCP server automatically
2. **Installs** slash commands (`/sync-docs`, `/research`)
3. **Creates** base research agents for codebase exploration

Then `/sync-docs` in Claude Code:
- Scans `package.json` / `requirements.txt` for dependencies
- Validates each library against Context7
- Generates `@research-{library}` agents with Context7 patterns

## Installation

### Project-level (recommended)

```bash
cd your-project
npx claude-docs
```

You'll be prompted for a Context7 API key (optional, increases rate limits).
Get one free at **[context7.com/dashboard](https://context7.com/dashboard)**.

This creates:
- `.mcp.json` - Context7 MCP server configuration
- `.claude/commands/` - `/sync-docs` and `/research` commands
- `.claude/agents/` - Base research agents

### Global installation

```bash
npx claude-docs --global
```

Installs to `~/.claude/` for use across all projects.

## Usage

### Generate Library Agents

After setup, run in Claude Code:

```
/sync-docs
```

This scans your dependencies and creates agents like:
- `@research-react` - React documentation specialist
- `@research-stripe` - Stripe documentation specialist
- `@research-next` - Next.js documentation specialist

### Research Libraries

**Direct invocation:**
```
@research-react how do I use useEffect cleanup?
```

**Via router:**
```
/research stripe webhook signature verification
```

### Base Agents

Always available after setup:

| Agent | Purpose |
|-------|---------|
| `@codebase-locator` | Find WHERE code lives |
| `@codebase-analyzer` | Understand HOW code works |
| `@codebase-pattern-finder` | Find EXAMPLES in the codebase |
| `@web-search-researcher` | Research topics not in Context7 |

## CLI Options

```
Usage: claude-docs [options]

Options:
  -V, --version   output the version number
  -g, --global    Install to ~/.claude/ instead of project
  --skip-mcp      Skip Context7 MCP configuration
  -h, --help      display help for command
```

## How It Works

### Step 1: `npx claude-docs`

- Prompts for Context7 API key (optional)
- Runs `claude mcp add` to configure Context7 MCP server
- Creates `.claude/commands/sync-docs.md` and `research.md`
- Creates base agent templates in `.claude/agents/`

### Step 2: `/sync-docs` in Claude Code

- Reads `package.json` / `requirements.txt`
- Queries Context7 to validate each library
- Creates `@research-{library}` agents with Context7 search patterns
- Updates `/research` router with agent list

### Step 3: Library agents query Context7

```typescript
// How agents query Context7
context7.getDocs("/facebook/react", {
  mode: "code",
  topic: "hooks",
  limit: 10
})
```

## Context7 API Key

An API key is **optional** but increases rate limits.

**Get one free:** [context7.com/dashboard](https://context7.com/dashboard)

The key is stored in `.mcp.json` as a header for the Context7 MCP server:

```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "your-key"
      }
    }
  }
}
```

## Troubleshooting

### Context7 MCP not configured

If you skipped MCP setup or it failed, configure manually:

```bash
claude mcp add --transport http --scope project context7 https://mcp.context7.com/mcp
```

With API key:
```bash
claude mcp add --transport http --scope project context7 https://mcp.context7.com/mcp \
  --header "CONTEXT7_API_KEY: your-key"
```

### Library not found in Context7

Not all libraries have Context7 coverage. The agent will be skipped.
Use `@web-search-researcher` for libraries not in Context7.

### Rate limiting

Get a free API key at [context7.com/dashboard](https://context7.com/dashboard).

## License

MIT
