# Changelog

All notable changes to sync-docs will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-13

### Added
- Initial release of sync-docs
- CLI tool for scaffolding Claude Code research workflow
- `/sync-docs` slash command template for generating library agents
- `/research` router command template for routing documentation questions
- Library agent Handlebars template (`research-library.md.hbs`)
- Base agents:
  - `codebase-locator` - Find files and code patterns
  - `codebase-analyzer` - Explain code implementation
  - `codebase-pattern-finder` - Show pattern examples
  - `web-search-researcher` - General web research
- Support for JavaScript/TypeScript projects (package.json)
- Support for Python projects (requirements.txt)
- Context7 integration for documentation lookup
- Optional API key prompt for higher rate limits
- Global installation support (`--global` flag)
- Incremental sync with backup for modified agents
- Clear logging of found vs. not-found libraries
- Comprehensive documentation (README, CONTRIBUTING)
- Example React app project

### Features
- **Context7-Only Protocol**: Never falls back to web search for documentation
- **Incremental Sync**: Preserves user modifications with .bak files
- **Template-Based**: Easy to customize agent prompts
- **Router Pattern**: Automatic delegation to specialized agents
- **Clear Logging**: Visual indicators for success/failure/warnings

### Documentation
- README.md with quick start and usage examples
- CONTRIBUTING.md with development guidelines
- Example project with expected output
- Inline documentation in all templates

## [Unreleased]

### Planned for Phase 2
- Support for Cargo.toml (Rust)
- Support for go.mod (Go)
- Support for pom.xml / build.gradle (Java)
- Support for Gemfile (Ruby)
- Monorepo/workspace scanning
- Version selection prompts
- `--add <lib>` for single library addition
- `--force` flag for full regeneration
- Framework variant auto-detection
- Team/shared configurations

### Planned for Phase 3
- Homebrew formula
- VS Code extension
- JetBrains plugin
- Context7 result caching
- Diagnostic command

---

[1.0.0]: https://github.com/yourusername/sync-docs/releases/tag/v1.0.0
