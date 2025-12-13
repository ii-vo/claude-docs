# Contributing to sync-docs

Thank you for your interest in contributing to sync-docs! This document provides guidelines and instructions for contributing.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node version, etc.)

### Suggesting Features

Feature requests are welcome! Please:
- Check existing issues first
- Describe the use case clearly
- Explain why it would benefit users
- Consider if it fits the MVP scope (see PRD_SYNC_DOCS.md)

### Improving Documentation

Documentation improvements are always appreciated:
- Fix typos or unclear explanations
- Add examples
- Improve README clarity
- Update outdated information

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Test thoroughly** (see Testing section below)
5. **Commit with clear messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/)
6. **Push and create a Pull Request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/sync-docs.git
cd sync-docs

# Install dependencies
npm install

# Build
npm run build

# Test locally
node dist/index.js --skip-key
```

## Project Structure

```
sync-docs/
├── src/
│   └── index.ts              # CLI entry point
├── templates/
│   ├── commands/
│   │   ├── sync-docs.md      # /sync-docs slash command
│   │   └── research.md       # /research router
│   ├── research-library.md.hbs  # Library agent template
│   └── *.md                  # Base agent templates
├── dist/                     # Compiled output (gitignored)
├── package.json
├── tsconfig.json
└── README.md
```

## Testing

### Manual Testing

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Test in a fresh project**:
   ```bash
   mkdir /tmp/test-project
   cd /tmp/test-project
   
   # Create a test package.json
   echo '{"dependencies": {"react": "^18.0.0"}}' > package.json
   
   # Run sync-docs
   node /path/to/sync-docs/dist/index.js --skip-key
   ```

3. **Verify files created**:
   ```bash
   ls -la .claude/commands/
   ls -la .claude/agents/
   ```

4. **Test in Claude Code**:
   - Open the test project in Claude Code
   - Run `/sync-docs`
   - Verify agents are generated
   - Test `@research-react` and `/research`

### Testing Checklist

Before submitting a PR, verify:

- [ ] `npm run build` succeeds without errors
- [ ] `npm run typecheck` passes
- [ ] CLI runs without errors: `node dist/index.js --skip-key`
- [ ] Files are created in correct locations
- [ ] Templates have valid frontmatter
- [ ] Generated agents work in Claude Code
- [ ] Documentation is updated if needed

## Code Style

- **TypeScript**: Use strict mode, no `any` types
- **Formatting**: Follow existing code style
- **Comments**: Add comments for complex logic
- **Naming**: Use descriptive variable/function names

## Improving Agent Templates

Agent templates are in `templates/`. When improving them:

### Guidelines

1. **Be specific**: Clear, actionable instructions
2. **Use examples**: Show don't tell
3. **Handle edge cases**: What if documentation isn't found?
4. **Cite sources**: Always reference Context7 snippets
5. **Test thoroughly**: Verify in Claude Code

### Template Structure

All agent templates should have:

```markdown
---
name: agent-name
description: Brief description
tools: Context7, Grep, etc.
model: sonnet
---

# Agent Title

Clear explanation of the agent's purpose.

## Instructions

Step-by-step instructions...

## Examples

Concrete examples...

## Edge Cases

How to handle errors...
```

### Testing Template Changes

1. Update template in `templates/`
2. Rebuild: `npm run build`
3. Run in test project: `node dist/index.js --skip-key`
4. Open in Claude Code
5. Test the agent with various queries
6. Verify it follows instructions correctly

## Adding New Base Agents

To add a new base agent:

1. **Create template**: `templates/your-agent.md`
2. **Add to CLI**: Update `src/index.ts` to copy the template
3. **Update README**: Document the new agent
4. **Test**: Verify it's created and works

Example:

```typescript
// In src/index.ts
const baseAgents = [
  'codebase-locator.md',
  'codebase-analyzer.md',
  'codebase-pattern-finder.md',
  'web-search-researcher.md',
  'your-new-agent.md'  // Add here
];
```

## Adding Language Support

To add support for a new language (e.g., Rust):

1. **Update /sync-docs template**: Add logic to read `Cargo.toml`
2. **Test with Rust project**: Verify dependencies are detected
3. **Update README**: Document the new language support
4. **Add example**: Include example in documentation

## Pull Request Guidelines

### PR Title

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

- `feat: add support for Cargo.toml`
- `fix: handle missing package.json gracefully`
- `docs: improve README examples`
- `refactor: simplify CLI argument parsing`

### PR Description

Include:
- **What**: What does this PR do?
- **Why**: Why is this change needed?
- **How**: How does it work?
- **Testing**: How did you test it?
- **Screenshots**: If UI/output changes

### Example PR Description

```markdown
## What
Adds support for reading dependencies from Cargo.toml for Rust projects.

## Why
Many developers use Rust and want sync-docs to work with their projects.

## How
- Added Cargo.toml parser to /sync-docs template
- Extracts dependencies from [dependencies] section
- Validates with Context7 same as npm packages

## Testing
- Created test Rust project with Cargo.toml
- Ran /sync-docs, verified dependencies detected
- Generated agents work correctly

## Screenshots
[Output showing Rust dependencies being processed]
```

## Code Review Process

1. **Automated checks**: CI runs build and typecheck
2. **Maintainer review**: A maintainer reviews your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, PR is merged
5. **Release**: Changes included in next release

## Release Process

(For maintainers)

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create git tag: `git tag v1.x.x`
4. Push tag: `git push origin v1.x.x`
5. Publish to npm: `npm publish`
6. Create GitHub release

## Questions?

- Open an issue for questions
- Tag maintainers for urgent matters
- Check existing issues/PRs first

## Code of Conduct

Be respectful, constructive, and collaborative. We're all here to build better tools together.

---

Thank you for contributing to sync-docs! 🚀
