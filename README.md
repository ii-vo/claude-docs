# sync-docs

> Claude Code research workflow tool that auto-configures library-specific sub-agents powered by Context7

## What is sync-docs?

`sync-docs` automatically creates specialized AI research agents for every library in your project. These agents use Context7 to provide accurate, up-to-date documentation directly in Claude Code.

**Instead of Claude guessing from outdated training data, your agents query official documentation in real-time.**

## Quick Start

```bash
# In your project directory
npx sync-docs

# Follow the prompts (API key is optional)
# This creates .claude/commands/ and .claude/agents/
```

Then in Claude Code:

```
/sync-docs
```

This scans your dependencies and generates library-specific agents like:
- `@research-react`
- `@research-next`
- `@research-stripe`
- etc.

## Usage

### Direct Agent Invocation

```
@research-react "explain the useEffect cleanup pattern"
@research-stripe "how do I verify webhook signatures?"
@research-next "what's the difference between app and pages router?"
```

### Router Command

```
/research stripe subscription lifecycle
/research how do I use React Server Components in Next.js?
```

The router automatically delegates to the appropriate specialized agent.

## What Gets Created

After running `npx sync-docs`:

```
your-project/
├── .claude/
│   ├── commands/
│   │   ├── sync-docs.md       # Scans dependencies, generates agents
│   │   └── research.md        # Routes questions to agents
│   └── agents/
│       ├── codebase-locator.md
│       ├── codebase-analyzer.md
│       ├── codebase-pattern-finder.md
│       ├── web-search-researcher.md
│       └── research-library.md.hbs  # Template for library agents
```

After running `/sync-docs` in Claude Code:

```
your-project/
├── .claude/
│   └── agents/
│       ├── research-react.md
│       ├── research-next.md
│       ├── research-stripe.md
│       └── ... (one per library in your project)
```

## How It Works

1. **Scan**: `/sync-docs` reads your `package.json` and `requirements.txt`
2. **Validate**: Each library is checked against Context7's documentation database
3. **Generate**: For each found library, a specialized agent is created with:
   - Correct Context7 library ID
   - Available documentation topics
   - Optimized search patterns
4. **Route**: The `/research` command routes questions to the right agent

## Context7 Integration

sync-docs uses [Context7](https://context7.com) for documentation lookup. Context7 provides:

- ✅ Official, up-to-date documentation
- ✅ Structured, searchable content
- ✅ Code examples and API references
- ✅ Topic-based organization

### API Key (Optional)

Without an API key, you get:
- Limited rate limits (sufficient for most use cases)
- Access to all public documentation

With an API key:
- Higher rate limits
- Priority access

To add your API key:
```bash
# During npx sync-docs setup
Enter Context7 API Key: your-key-here

# Or manually add to .claude/.env
CONTEXT7_API_KEY=your-key-here
```

## CLI Options

```bash
npx sync-docs [options]

Options:
  -g, --global     Install to ~/.claude/ instead of project directory
  --skip-key       Skip API key prompt
  -h, --help       Show help
```

### Global Installation

```bash
npx sync-docs --global
```

Creates agents in `~/.claude/` for use across all projects.

## Supported Languages

**Phase 1 (Current):**
- JavaScript/TypeScript (`package.json`)
- Python (`requirements.txt`)

**Future:**
- Rust (`Cargo.toml`)
- Go (`go.mod`)
- Java (`pom.xml`, `build.gradle`)
- Ruby (`Gemfile`)

## Examples

### Example 1: React Hooks Question

```
You: @research-react "explain useState with examples"

@research-react: I'm querying Context7 for React documentation on useState...

Based on the official React documentation:

useState is a Hook that lets you add state to functional components.

Basic usage:
```javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

Key points:
- Returns array with [currentState, setterFunction]
- Initial state can be a value or function
- Setter function triggers re-render

Source: Context7 snippet #react-hooks-state
```

### Example 2: Multi-Library Question

```
You: /research how do I integrate Stripe with Next.js?

/research: This involves both Stripe and Next.js. I'll consult both specialists.

@research-stripe What are the recommended patterns for integrating Stripe with Next.js?

@research-next What are the best practices for integrating payment providers in Next.js?

[Synthesizes responses into cohesive answer]
```

## Troubleshooting

### Library Not Found in Context7

```
✗ internal-utils - Not found in Context7 (skipping)
```

This is expected for:
- Internal/private packages
- Very new or niche libraries
- Non-public documentation

**Solution:** Use `@web-search-researcher` for general web research on these libraries.

### No Manifests Found

```
⚠ No package.json or requirements.txt found in project root.
```

**Solution:** Run `npx sync-docs` from your project root directory.

### Rate Limit Reached

```
⚠ Context7 rate limit reached. Processed 8/12 libraries.
```

**Solution:** Add a Context7 API key to `.claude/.env` for higher limits.

## Base Agents

sync-docs includes these base agents for general research:

- **@codebase-locator** - Finds files, directories, and code patterns in your project
- **@codebase-analyzer** - Explains how code works in your project
- **@codebase-pattern-finder** - Shows examples of patterns in your codebase
- **@web-search-researcher** - General web research for topics not in Context7

## Incremental Sync

Running `/sync-docs` multiple times is safe:

- **New libraries** → Creates new agents
- **Existing libraries** → Updates if template changed
- **Modified agents** → Backs up to `.bak` before updating
- **Removed libraries** → Keeps agents (you may want them)

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Improving Agent Templates

The agent templates are in `templates/`:
- `commands/sync-docs.md` - The sync command logic
- `commands/research.md` - The router logic
- `research-library.md.hbs` - Library agent template
- Base agent templates (codebase-locator, etc.)

PRs to improve prompts, add features, or fix bugs are appreciated!

## License

MIT

## Links

- [Context7 Documentation](https://context7.com/docs)
- [Claude Code](https://claude.ai/code)
- [GitHub Repository](https://github.com/yourusername/sync-docs)

## FAQ

### Q: Do I need a Context7 API key?

No, but it's recommended for higher rate limits. The free tier works for most projects.

### Q: Can I customize the generated agents?

Yes! Edit the files in `.claude/agents/`. They'll be backed up before updates.

### Q: What if my library isn't in Context7?

Use `@web-search-researcher` for general web research, or manually create an agent.

### Q: Does this work with monorepos?

Phase 1 scans the root `package.json`. Monorepo support is planned for Phase 2.

### Q: Can I use this without Claude Code?

The agents are markdown files with prompts. They could be adapted to other AI coding tools.

---

**Built with ❤️ for better AI-assisted development**
