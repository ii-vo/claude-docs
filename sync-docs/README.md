# sync-docs

Claude Code research workflow tool that auto-configures library-specific sub-agents via Context7.

## Quick Start

```bash
# 1. Scaffold Claude Code configuration
npx sync-docs

# 2. In Claude Code, generate library agents
/sync-docs

# 3. Use library-specific research
@research-react "explain useState hooks"
/research stripe webhook verification
```

## What It Does

`sync-docs` automatically creates specialized AI research agents for every library in your project:

1. **Scans** your `package.json` and `requirements.txt` for dependencies
2. **Validates** each library against Context7's documentation index
3. **Generates** library-specific agents with correct Context7 search patterns
4. **Provides** both direct invocation (`@research-react`) and router (`/research`) patterns

## Prerequisites

- [Claude Code](https://claude.ai/code) CLI installed
- (Optional) [Context7 MCP server](https://github.com/upstash/context7) configured for library validation
- (Optional) `CONTEXT7_API_KEY` in `.env` for higher rate limits

## Installation

### Project-level (recommended)

```bash
cd your-project
npx sync-docs
```

Creates `.claude/` directory in your project with:
- `/sync-docs` - Generate library agents from dependencies
- `/research` - Route documentation queries to specialists
- Base agents for codebase research

### Global installation

```bash
npx sync-docs --global
```

Installs to `~/.claude/` for use across all projects.

## Usage

### Generate Library Agents

After scaffolding, run in Claude Code:

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

These are always available:

- `@codebase-locator` - Find WHERE code lives
- `@codebase-analyzer` - Understand HOW code works
- `@codebase-pattern-finder` - Find EXAMPLES in the codebase
- `@web-search-researcher` - Research topics not in Context7

## CLI Options

```
Usage: sync-docs [options]

Options:
  -V, --version  output the version number
  -g, --global   Install to ~/.claude/ instead of project
  --skip-key     Skip API key prompt
  -h, --help     display help for command
```

## How It Works

1. `npx sync-docs` scaffolds the Claude Code configuration:
   - Creates `.claude/commands/sync-docs.md` (slash command)
   - Creates `.claude/commands/research.md` (router)
   - Creates base agent templates in `.claude/agents/`

2. `/sync-docs` (in Claude Code) generates library agents:
   - Reads `package.json` / `requirements.txt`
   - Validates each library against Context7
   - Creates `@research-{library}` agents with Context7 patterns
   - Updates `/research` router with agent list

3. Library agents query Context7 for accurate, up-to-date documentation

## Context7 Integration

Library agents use Context7 to provide accurate documentation:

```typescript
// How agents query Context7
context7.getDocs("/facebook/react", {
  mode: "code",
  topic: "hooks",
  limit: 10
})
```

**Without Context7 MCP:** The `/sync-docs` command will fail gracefully and explain how to configure Context7.

**Libraries not in Context7:** Logged clearly and skipped. Use `@web-search-researcher` for manual research.

## Troubleshooting

### "Context7 MCP server not configured"

The `/sync-docs` command requires Context7 MCP. See [Context7 setup](https://github.com/upstash/context7).

### "Library not found in Context7"

Not all libraries have Context7 coverage. The agent will be skipped. Use `@web-search-researcher` instead.

### Rate limiting

Add `CONTEXT7_API_KEY` to your `.env` file for higher rate limits.

## License

MIT
