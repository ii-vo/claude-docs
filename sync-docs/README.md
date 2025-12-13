# sync-docs

**Claude Code research workflow tool** - Automatically configure library-specific research agents powered by Context7.

[![npm version](https://badge.fury.io/js/sync-docs.svg)](https://www.npmjs.com/package/sync-docs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What It Does

`sync-docs` scans your project dependencies and generates specialized AI research agents for each library. These agents provide accurate, up-to-date documentation context during development by querying Context7's documentation database.

**Key Features:**
- 🔍 Auto-detects libraries from `package.json` and `requirements.txt`
- ✅ Validates documentation availability via Context7
- 🤖 Generates library-specific research agents
- 📚 Includes base codebase research agents
- 🔄 Supports incremental updates
- 🎯 Direct invocation (`@research-react`) or router (`/research`) patterns

## Quick Start

### 1. Run sync-docs

```bash
npx sync-docs
```

This scaffolds the `.claude/` directory with slash commands and base agents.

### 2. Generate Library Agents

Open your project in Claude Code and run:

```
/sync-docs
```

This scans your dependencies and creates library-specific research agents.

### 3. Use the Agents

**Direct invocation:**
```
@research-react "explain useState hook"
@research-stripe "webhook signature verification"
```

**Via router:**
```
/research next.js app router layouts
/research stripe subscription lifecycle
```

## Installation

### Project Scope (Recommended)

```bash
cd your-project
npx sync-docs
```

Creates `.claude/` in your project directory.

### Global Scope

```bash
npx sync-docs --global
```

Creates `.claude/` in your home directory (~/.claude/).

### CLI Options

```bash
npx sync-docs [options]

Options:
  -g, --global     Install to ~/.claude/ instead of project
  --skip-key       Skip API key prompt
  -h, --help       Show help
```

## How It Works

### Phase 1: Scaffolding (npx sync-docs)

Creates the following structure:

```
.claude/
├── commands/
│   ├── sync-docs.md          # Slash command for generating agents
│   └── research.md           # Router command
└── agents/
    ├── codebase-locator.md   # Find code locations
    ├── codebase-analyzer.md  # Explain implementations
    ├── codebase-pattern-finder.md  # Find usage patterns
    └── web-search-researcher.md    # Web research fallback
```

### Phase 2: Agent Generation (/sync-docs in Claude Code)

1. Scans `package.json` and `requirements.txt`
2. Validates each library with Context7
3. Generates research agents for found libraries
4. Updates `/research` router with agent list

Example output:

```
Scanning project dependencies...
✓ Found package.json with 12 dependencies

Validating with Context7...
✓ react - Found: 2,847 snippets
✓ stripe - Found: 892 snippets
✗ internal-lib - Not found in Context7

Creating agents...
✓ .claude/agents/research-react.md
✓ .claude/agents/research-stripe.md

Sync complete! Generated 2 agents, skipped 1
```

## Available Agents

### Base Agents (Always Created)

- **@codebase-locator** - Finds files, functions, and components
- **@codebase-analyzer** - Explains how code works
- **@codebase-pattern-finder** - Shows usage patterns and examples
- **@web-search-researcher** - Web research for uncovered libraries

### Library Agents (Generated per Project)

- **@research-{library}** - Library-specific documentation specialist
- Each agent queries Context7 for current, official documentation
- Never relies on outdated training data

## Context7 API Key (Optional)

The Context7 API has rate limits for unauthenticated requests. For better performance:

1. Get an API key from [Context7](https://context7.com)
2. When prompted by `npx sync-docs`, enter your key
3. Or add to `.env`:
   ```
   CONTEXT7_API_KEY=your_key_here
   ```

## Incremental Updates

Re-running `/sync-docs` will:

- ✅ Add agents for new libraries
- ✅ Preserve existing agents
- ✅ Backup modified agents to `.bak` before updating
- ✅ Update `/research` router with new agents

```bash
# After adding new dependencies
/sync-docs
```

## Examples

### Research Library Documentation

```
User: @research-react "How do I use useEffect cleanup?"

@research-react: [Queries Context7 for React useEffect cleanup]
Based on the official React documentation, cleanup functions in useEffect...
```

### Route via /research

```
User: /research stripe webhooks

/research: [Routes to @research-stripe]
@research-stripe: [Queries Context7 for Stripe webhooks]
According to Stripe's documentation, webhooks are...
```

### Find Code Patterns

```
User: @codebase-pattern-finder "How do we handle errors?"

@codebase-pattern-finder: [Searches codebase]
Found error handling pattern in 12 files:
- src/api/users.ts:45 - try-catch with logging
- src/api/auth.ts:89 - async error handling
...
```

## Supported Languages

**Current (MVP):**
- JavaScript/TypeScript (`package.json`)
- Python (`requirements.txt`)

**Planned:**
- Rust (`Cargo.toml`)
- Go (`go.mod`)
- Java (`pom.xml`, `build.gradle`)
- Ruby (`Gemfile`)

## Troubleshooting

### Library Not Found in Context7

```
✗ my-library - Not found in Context7
```

**Solution:** Use `@web-search-researcher` for manual research:
```
@web-search-researcher "my-library documentation"
```

### No Dependencies Detected

```
⚠ No package.json or requirements.txt found
```

**Solution:** Ensure you have a valid manifest file in your project root.

### Rate Limit Errors

```
⚠ Context7 rate limit reached
```

**Solution:** Add a Context7 API key to `.env` for higher limits.

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Areas for Contribution:**
- Additional language support (Cargo.toml, go.mod, etc.)
- Improved agent templates
- Bug fixes and error handling
- Documentation improvements

## License

MIT License - see [LICENSE](LICENSE) for details.

## Links

- [GitHub Repository](https://github.com/yourusername/sync-docs)
- [Context7 Documentation](https://context7.com/docs)
- [Claude Code](https://claude.ai/code)
- [Report Issues](https://github.com/yourusername/sync-docs/issues)

## Credits

Built for the Claude Code community. Powered by Context7.

---

**Version:** 1.0.0
**Status:** Production Ready
