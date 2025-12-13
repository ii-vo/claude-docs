# Contributing to sync-docs

Thank you for your interest in contributing to sync-docs! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Code Style](#code-style)

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/sync-docs.git`
3. Create a branch: `git checkout -b feature/your-feature-name`

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- TypeScript 5.6+

### Install Dependencies

```bash
npm install
```

### Build

```bash
npm run build
```

### Test Locally

```bash
# Link the package locally
npm link

# In a test project
cd /path/to/test-project
sync-docs --skip-key
```

## Project Structure

```
sync-docs/
├── bin/                    # Compiled CLI entry point
├── src/
│   └── index.ts           # CLI implementation
├── templates/
│   ├── commands/          # Slash command templates
│   │   ├── sync-docs.md   # /sync-docs command
│   │   └── research.md    # /research router
│   └── agents/            # Agent templates
│       ├── codebase-locator.md
│       ├── codebase-analyzer.md
│       ├── codebase-pattern-finder.md
│       ├── web-search-researcher.md
│       └── research-library.md.hbs  # Library agent template
├── package.json
├── tsconfig.json
├── README.md
└── CONTRIBUTING.md
```

## Making Changes

### Types of Contributions

#### 1. Improving Agent Templates

Agent templates are in `templates/agents/`. These define the prompts and behavior for research agents.

**To improve an agent:**
1. Edit the markdown file in `templates/agents/`
2. Test with Claude Code to verify behavior
3. Document changes in your PR

**Guidelines:**
- Keep prompts clear and specific
- Include examples where helpful
- Maintain neutral, documentarian tone
- Don't add personal opinions or biases

#### 2. Adding Language Support

To add support for a new language (e.g., Rust, Go):

1. **Update `src/index.ts`** to detect the new manifest file:
   ```typescript
   // Add support for Cargo.toml
   if (existsSync('Cargo.toml')) {
     // Parse Cargo.toml dependencies
   }
   ```

2. **Update `/sync-docs` template** in `templates/commands/sync-docs.md`:
   ```markdown
   ### Scan Cargo.toml (if exists)
   // Add parsing logic
   ```

3. **Add tests** to verify detection works

4. **Update README** to list supported languages

#### 3. CLI Features

New CLI features go in `src/index.ts`.

**Examples:**
- `--force` flag to regenerate all agents
- `--add <library>` to add single library
- Better error messages

**Guidelines:**
- Use Commander.js for option parsing
- Keep CLI output clean and informative
- Handle errors gracefully
- Update README with new options

#### 4. Bug Fixes

1. Create an issue describing the bug
2. Reference the issue in your PR
3. Include steps to reproduce
4. Add test case if applicable

## Testing

### Manual Testing

```bash
# Build the project
npm run build

# Link locally
npm link

# Create test project
mkdir test-project && cd test-project
echo '{"dependencies": {"react": "^18.0.0"}}' > package.json

# Run CLI
sync-docs --skip-key

# Verify files created
ls -R .claude/
```

### Testing Templates

1. Create `.claude/` directory in a test project
2. Copy templates manually
3. Open Claude Code
4. Test slash commands and agents
5. Verify behavior matches expectations

### Checklist Before PR

- [ ] Code builds without errors (`npm run build`)
- [ ] TypeScript types are correct (`npm run typecheck`)
- [ ] CLI works in fresh project
- [ ] Templates are valid markdown
- [ ] README updated if adding features
- [ ] No sensitive data in commits

## Submitting Changes

### Commit Messages

Use conventional commits:

```
feat: add Cargo.toml support
fix: handle missing package.json gracefully
docs: update README with examples
chore: update dependencies
```

### Pull Request Process

1. **Create PR** from your fork to `main`
2. **Title:** Clear, descriptive (e.g., "Add Rust Cargo.toml support")
3. **Description:**
   - What changed
   - Why the change is needed
   - How to test it
4. **Link issues** if applicable (Fixes #123)
5. **Wait for review**

### PR Template

```markdown
## Description
Brief description of changes

## Motivation
Why is this change needed?

## Changes Made
- Change 1
- Change 2

## Testing
How to test these changes

## Checklist
- [ ] Code builds
- [ ] Tested locally
- [ ] README updated
- [ ] No breaking changes
```

## Code Style

### TypeScript

- Use ES6+ features
- Async/await over callbacks
- Descriptive variable names
- Add comments for complex logic

### Markdown (Templates)

- Use clear headings
- Include code examples
- Keep tone neutral
- Use proper formatting

### File Organization

- Keep related code together
- Use clear file names
- Update imports when moving files

## Areas for Contribution

### High Priority

- [ ] Cargo.toml (Rust) support
- [ ] go.mod (Go) support
- [ ] Better error messages
- [ ] Progress indicators during sync
- [ ] Version handling improvements

### Medium Priority

- [ ] Monorepo/workspace support
- [ ] `--force` flag implementation
- [ ] `--add <library>` flag
- [ ] Homebrew formula
- [ ] Windows compatibility testing

### Low Priority

- [ ] VS Code extension
- [ ] JetBrains plugin
- [ ] Context7 result caching
- [ ] Interactive library selection

## Questions?

- Open an issue for questions
- Tag with `question` label
- We'll respond within a few days

## License

By contributing, you agree your contributions will be licensed under the MIT License.

---

Thank you for contributing to sync-docs! 🎉
