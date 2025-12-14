# Contributing to claude-docs

Thank you for your interest in contributing!

## Development Setup

```bash
# Clone the repository
git clone https://github.com/your-org/claude-docs.git
cd claude-docs/sync-docs

# Install dependencies
npm install

# Build
npm run build

# Link for local testing
npm link

# Test in a project
cd /path/to/test-project
claude-docs --skip-mcp
```

## Project Structure

```
claude-docs/
├── sync-docs/                   # Main package (npm: claude-docs)
│   ├── dist/index.js            # Compiled CLI entry point
│   ├── src/index.ts             # CLI source
│   ├── templates/
│   │   ├── commands/
│   │   │   ├── sync-docs.md     # /sync-docs slash command
│   │   │   └── research.md      # /research router
│   │   └── agents/
│   │       ├── codebase-locator.md
│   │       ├── codebase-analyzer.md
│   │       ├── codebase-pattern-finder.md
│   │       ├── web-search-researcher.md
│   │       └── research-library.md.hbs
│   ├── package.json
│   └── tsconfig.json
├── PRD_SYNC_DOCS.md             # Product requirements
├── IMPLEMENTATION_PLAN.md       # Implementation checklist
└── CLAUDE.md                    # Claude Code instructions
```

## How to Contribute

### Adding New Base Agents

1. Create a new `.md` file in `templates/agents/`
2. Include frontmatter with name, description, tools, and model
3. Write clear instructions for the agent's purpose
4. Update `src/index.ts` to copy the new agent during scaffolding
5. Submit a PR with example usage

### Improving Templates

The `/sync-docs` and `/research` templates are the core of this tool. Improvements welcome:

- Clearer instructions for Claude Code
- Better error handling patterns
- More robust Context7 query patterns
- Improved output formatting

### Improving the Library Agent Template

`templates/agents/research-library.md.hbs` is a Handlebars template used to generate library-specific agents. Variables available:

- `{{library}}` - lowercase library name (e.g., "react")
- `{{Library}}` - title case library name (e.g., "React")
- `{{context7_id}}` - Context7 library ID (e.g., "/facebook/react")
- `{{total_snippets}}` - number of documentation snippets
- `{{topics}}` - comma-separated topic list
- `{{topicsList}}` - array of topics for iteration

### Adding Manifest Support

Currently supports `package.json` and `requirements.txt`. To add new manifest types:

1. Update the `/sync-docs` template to detect the new manifest
2. Add parsing logic for the manifest format
3. Test with a project using that manifest
4. Submit a PR with test cases

## Code Style

- TypeScript with strict mode
- ES2022 target, ESNext modules
- No semicolons (optional, just be consistent)
- Clear, descriptive variable names

## Pull Request Guidelines

1. **One feature per PR** - Keep PRs focused
2. **Test locally** - Run `npm run build` and test scaffolding
3. **Update README** - If adding features, document them
4. **Conventional commits** - Use `feat:`, `fix:`, `docs:`, etc.

## Questions?

Open an issue on GitHub for questions or feature requests.
