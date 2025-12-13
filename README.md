# Context7 Research Workflow

Context7-powered documentation research workflow for Claude Code with automatic sub-agent generation.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/murmelisotilas/context7-research-workflow.git
cd context7-research-workflow

# Install dependencies
npm install

# Configure your API key
cp .env.example .env
# Edit .env and add your Context7 API key

# Try it out
npm run search "authentication"
npm run get-docs "typescript-basics"
```

## 📖 What This Tool Does

A TypeScript CLI tool that integrates with Context7's SDK to automate documentation workflows:

- **Search Documentation**: Search across library documentation and save results to markdown
- **Get Specific Docs**: Retrieve detailed documentation by identifier
- **Static Markdown Output**: All results saved as version-controllable markdown files
- **File Safety**: Confirmation prompts before overwriting existing files

## 🎯 Features

✅ **MVP Complete**
- Search library documentation command
- Get specific docs command
- Static markdown output with timestamps
- File overwrite confirmation prompts
- Mock SDK implementation (ready for real integration)
- Full TypeScript type safety
- ES modules architecture
- Comprehensive error handling

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[PROJECT_README.md](./PROJECT_README.md)** - Complete usage guide
- **[MVP_PRD.md](./MVP_PRD.md)** - Full product requirements (2800+ lines)
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical details
- **[START_HERE.md](./START_HERE.md)** - Project overview

## 🛠️ Usage

### Search Library Documentation

```bash
npm run search "your search query"
```

Example:
```bash
npm run search "authentication tutorial"
```

Output: `output/search-authentication-tutorial-20251213.md`

### Get Specific Documentation

```bash
npm run get-docs "doc-identifier"
```

Example:
```bash
npm run get-docs "typescript-basics"
```

Output: `output/docs-typescript-basics-20251213.md`

## 🏗️ Project Structure

```
context7-research-workflow/
├── src/
│   ├── commands/
│   │   ├── search-library.ts    # Search command
│   │   └── get-docs.ts          # Get docs command
│   ├── utils/
│   │   ├── file-operations.ts   # File handling
│   │   └── prompt.ts            # User prompts
│   ├── config/
│   │   └── context7-config.ts   # Configuration
│   ├── lib/
│   │   └── context7-sdk-mock.ts # Mock SDK
│   └── index.ts                 # CLI entry point
├── output/                      # Generated markdown files
└── Documentation files
```

## 🔧 Development

```bash
# Run in development mode
npm run dev -- search "query"
npm run dev -- get-docs "identifier"

# Type checking
npm run typecheck

# Build production version
npm run build

# Run built version
npm start search "query"
```

## 🔌 Context7 SDK Integration

The project currently uses a **mock SDK implementation** that demonstrates functionality with sample data.

When the `@context7/sdk` package becomes available:

1. Install the package: `npm install @context7/sdk`
2. Replace mock imports in command files
3. Test with your API key

The code is ready - just swap the imports!

## 📋 Requirements

- Node.js 22 or higher
- Context7 API key

## 🗺️ Roadmap

### Phase 1: MVP ✅ (Current)
- [x] TypeScript project setup
- [x] Search library command
- [x] Get docs command
- [x] Markdown output
- [x] File overwrite confirmation
- [x] Basic error handling
- [x] Mock SDK (ready for real API)

### Phase 2: Distribution (Planned)
- [ ] npm package publication
- [ ] Installer scripts (`npx` support)
- [ ] Platform-specific binaries
- [ ] Homebrew formula (macOS)

### Phase 3: Enhancements (Future)
- [ ] Enhanced error reporting
- [ ] Configuration file support
- [ ] Multiple output formats
- [ ] Caching layer
- [ ] Progress indicators
- [ ] Interactive mode
- [ ] Batch operations

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT

## 🔗 Links

- [Context7 Documentation](https://context7.com/docs)
- [Context7 TypeScript SDK](https://context7.com/docs/sdks/ts)

---

**Built with Context7 SDK** | **TypeScript** | **Node.js 22**
