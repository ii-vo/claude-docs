# Example React App

This is an example project to demonstrate sync-docs usage.

## Setup

```bash
# Run sync-docs
npx sync-docs

# Or with API key
npx sync-docs
# Enter your Context7 API key when prompted
```

## Expected Output

```
🚀 sync-docs - Setting up Claude Code research workflow

📁 Target directory: /path/to/example-react-app/.claude

✓ Created .claude/commands/sync-docs.md
✓ Created .claude/commands/research.md
✓ Created .claude/agents/codebase-locator.md
✓ Created .claude/agents/codebase-analyzer.md
✓ Created .claude/agents/codebase-pattern-finder.md
✓ Created .claude/agents/web-search-researcher.md
✓ Created .claude/agents/research-library.md.hbs

✅ Setup complete!

Next steps:
1. Open your project in Claude Code
2. Run /sync-docs to generate library-specific agents
3. Use @research-{library} or /research to query documentation
```

## In Claude Code

After opening this project in Claude Code, run:

```
/sync-docs
```

Expected output:

```
Scanning project dependencies...
✓ Found package.json with 4 dependencies

Validating libraries with Context7...
✓ react - Found: 2,847 snippets, topics: hooks, components, api
✓ react-dom - Found: 892 snippets, topics: rendering, hydration
✓ stripe - Found: 892 snippets, topics: payments, subscriptions, webhooks
✓ axios - Found: 456 snippets, topics: requests, interceptors, config

Creating library agents...
✓ .claude/agents/research-react.md
✓ .claude/agents/research-react-dom.md
✓ .claude/agents/research-stripe.md
✓ .claude/agents/research-axios.md

Updating /research router...
✓ Added 4 library agents to router

✅ Sync complete!
```

## Usage Examples

### Direct Agent Invocation

```
@research-react "explain the useEffect cleanup pattern"
@research-stripe "how do I verify webhook signatures?"
@research-axios "how do I set default headers?"
```

### Router Command

```
/research how do I make authenticated API calls with axios?
/research stripe subscription lifecycle
/research React hooks best practices
```

## Files Created

After running `/sync-docs`:

```
.claude/
├── commands/
│   ├── sync-docs.md
│   └── research.md
└── agents/
    ├── codebase-locator.md
    ├── codebase-analyzer.md
    ├── codebase-pattern-finder.md
    ├── web-search-researcher.md
    ├── research-library.md.hbs
    ├── research-react.md
    ├── research-react-dom.md
    ├── research-stripe.md
    └── research-axios.md
```
