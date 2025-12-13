# Quick Start Guide

## Installation

```bash
npx sync-docs
```

That's it! This creates `.claude/` directory with all necessary files.

## Usage in Claude Code

### Step 1: Generate Library Agents

```
/sync-docs
```

This scans your dependencies and creates specialized agents.

### Step 2: Ask Questions

**Direct agent invocation:**
```
@research-react "explain useState"
@research-stripe "webhook verification"
```

**Router (auto-delegates):**
```
/research how do I use React hooks?
/research stripe subscription lifecycle
```

## What Gets Created

```
.claude/
├── commands/
│   ├── sync-docs.md    # Generates library agents
│   └── research.md     # Routes questions
└── agents/
    ├── research-react.md       # Generated per library
    ├── research-stripe.md      # Generated per library
    ├── codebase-locator.md     # Find code
    ├── codebase-analyzer.md    # Explain code
    ├── codebase-pattern-finder.md  # Show patterns
    └── web-search-researcher.md    # Web fallback
```

## Options

```bash
npx sync-docs --global    # Install to ~/.claude/
npx sync-docs --skip-key  # Skip API key prompt
```

## Troubleshooting

**Library not found?**
```
✗ my-lib - Not found in Context7
```
Use `@web-search-researcher` for that library.

**Need API key?**
Add to `.claude/.env`:
```
CONTEXT7_API_KEY=your-key-here
```

## Examples

### React Question
```
You: @research-react "what's the useEffect cleanup pattern?"

Agent: [Queries Context7 for React docs]
Based on official React documentation...
[Provides answer with code examples]
```

### Multi-Library Question
```
You: /research how do I integrate Stripe with Next.js?

Router: [Routes to both @research-stripe and @research-next]
[Synthesizes comprehensive answer]
```

## Learn More

- Full documentation: [README.md](README.md)
- Contributing: [CONTRIBUTING.md](CONTRIBUTING.md)
- Changelog: [CHANGELOG.md](CHANGELOG.md)

---

**That's it! You're ready to use sync-docs.** 🚀
