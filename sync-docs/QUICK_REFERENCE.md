# sync-docs - Quick Reference

## Installation

```bash
# Project scope
cd your-project
npx sync-docs

# Global scope
npx sync-docs --global

# Skip API key prompt
npx sync-docs --skip-key
```

## Usage in Claude Code

### Generate Library Agents
```
/sync-docs
```

### Research Commands
```
# Direct invocation
@research-react "explain useState"
@research-stripe "webhook verification"

# Via router
/research next.js app router
/research stripe subscriptions
```

### Codebase Research
```
@codebase-locator "where is authentication handled?"
@codebase-analyzer "how does login work?"
@codebase-pattern-finder "show error handling patterns"
@web-search-researcher "search for X documentation"
```

## File Structure

```
.claude/
├── commands/
│   ├── sync-docs.md   # /sync-docs command
│   └── research.md    # /research router
└── agents/
    ├── codebase-locator.md
    ├── codebase-analyzer.md
    ├── codebase-pattern-finder.md
    ├── web-search-researcher.md
    └── research-*.md  # Generated per library
```

## Environment Variables

```bash
# .env (optional)
CONTEXT7_API_KEY=your_key_here
```

## Commands

```bash
# In sync-docs directory
npm run build      # Compile TypeScript
npm run typecheck  # Type check
npm run dev        # Run in dev mode
```

## Troubleshooting

**Library not found:**
```
✗ my-lib - Not found in Context7
→ Use @web-search-researcher instead
```

**No dependencies detected:**
```
⚠ No package.json found
→ Create package.json in project root
```

**Rate limited:**
```
⚠ Rate limit reached
→ Add CONTEXT7_API_KEY to .env
```

## Links

- GitHub: github.com/yourusername/sync-docs
- npm: npmjs.com/package/sync-docs
- Context7: context7.com
- Claude Code: claude.ai/code

## Support

- Issues: github.com/yourusername/sync-docs/issues
- Discussions: github.com/yourusername/sync-docs/discussions
- Email: your@email.com
