# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-13

### Added

#### CLI Tool
- Initial release of `npx sync-docs` CLI
- `--global` flag for user-level installation
- `--skip-key` flag to skip API key prompt
- Interactive Context7 API key prompt
- Automatic scaffolding of `.claude/` directory structure

#### Slash Commands
- `/sync-docs` - Generates library-specific research agents
  - Scans package.json and requirements.txt
  - Validates libraries via Context7
  - Creates optimized research agents
  - Updates /research router
  - Incremental sync with backup support
- `/research` - Routes documentation queries to specialized agents

#### Base Agents
- `@codebase-locator` - Finds code locations in the codebase
- `@codebase-analyzer` - Explains how code works
- `@codebase-pattern-finder` - Shows usage patterns and examples
- `@web-search-researcher` - Web research for uncovered libraries

#### Templates
- Handlebars template for library-specific agents
- Context7-only validation protocol
- Clear logging for found/not-found libraries
- Backup system for user modifications

#### Language Support
- JavaScript/TypeScript (package.json)
- Python (requirements.txt)

#### Documentation
- Comprehensive README with quick start guide
- CONTRIBUTING.md with development guidelines
- MIT License
- Example usage patterns

### Features

- ✅ Auto-detection of project dependencies
- ✅ Context7 validation with clear logging
- ✅ Library-specific agent generation
- ✅ Incremental updates with backup preservation
- ✅ Direct invocation (@research-{library}) pattern
- ✅ Router (/research) pattern for natural queries
- ✅ Base codebase research agents
- ✅ Web search fallback for uncovered libraries

### Technical Details

- Built with TypeScript 5.6
- ES2022 target, ESNext modules
- Dependencies: commander, prompts, dotenv
- Context7 SDK integration
- Node.js 18+ required

## [Unreleased]

### Planned for Future Releases

- Cargo.toml (Rust) support
- go.mod (Go) support
- pom.xml/build.gradle (Java) support
- Gemfile (Ruby) support
- Monorepo/workspace scanning
- `--force` flag for full regeneration
- `--add <library>` for single library
- Version handling improvements
- Progress indicators during sync
- Homebrew formula
- VS Code extension

---

**Note:** This is the initial MVP release. See PRD_SYNC_DOCS.md and IMPLEMENTATION_PLAN.md for full feature roadmap.
