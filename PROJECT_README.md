# Context7 Documentation Tool

A TypeScript-based CLI tool that integrates with Context7's SDK to streamline documentation workflows. Search library documentation and retrieve specific docs, outputting results to static markdown files.

## Features

- **Search Library Documentation** - Search across libraries using Context7 API
- **Retrieve Specific Docs** - Get detailed documentation by identifier
- **Static Markdown Output** - Results saved as version-controllable markdown files
- **Safe File Operations** - Confirmation prompt before overwriting existing files
- **TypeScript** - Fully typed with modern ES modules

## Prerequisites

- Node.js 22 or higher
- Context7 API key

## Installation

1. Clone or navigate to this repository:
```bash
cd context7-docs-tool
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
cp .env.example .env
```

4. Add your Context7 API key to `.env`:
```
CONTEXT7_API_KEY=your_api_key_here
OUTPUT_DIR=./output
```

## Usage

### Search Library Documentation

Search for documentation across libraries:

```bash
npm run search "your search query"
```

Example:
```bash
npm run search "authentication"
```

Output:
```
Searching for: "authentication"
Found 5 result(s)...
✓ File saved successfully: output/search-authentication-20251213.md
```

### Get Specific Documentation

Retrieve documentation by identifier:

```bash
npm run get-docs "doc-identifier"
```

Example:
```bash
npm run get-docs "typescript-basics"
```

Output:
```
Retrieving documentation: "typescript-basics"
Retrieved: TypeScript Basics
✓ File saved successfully: output/docs-typescript-basics-20251213.md
```

### File Overwrite Confirmation

If a file already exists, you'll be prompted:

```
File already exists: output/search-authentication-20251213.md
Overwrite? (y/n):
```

- Press `y` to overwrite
- Press `n` to cancel
- Press `Ctrl+C` to exit

## Project Structure

```
context7-docs-tool/
├── src/
│   ├── commands/
│   │   ├── search-library.ts    # Search command implementation
│   │   └── get-docs.ts          # Get docs command implementation
│   ├── utils/
│   │   ├── file-operations.ts   # File handling utilities
│   │   └── prompt.ts            # User prompt utilities
│   ├── config/
│   │   └── context7-config.ts   # Configuration management
│   └── index.ts                 # Main CLI entry point
├── output/                      # Generated markdown files
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Development

### Run in Development Mode

```bash
npm run dev -- search "query"
npm run dev -- get-docs "identifier"
```

### Type Checking

```bash
npm run typecheck
```

### Build

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Run Built Version

```bash
npm start search "query"
npm start get-docs "identifier"
```

## Output Format

### Search Results

Generated files: `search-{query}-{date}.md`

```markdown
# Search Results: authentication

**Generated:** 2025-12-13T10:30:00.000Z
**Total Results:** 5

---

## Results

### 1. Authentication Guide
**Library:** MyLibrary
**URL:** https://example.com/docs/auth

Complete guide to authentication...

---

### 2. OAuth Implementation
...
```

### Documentation

Generated files: `docs-{identifier}-{date}.md`

```markdown
# TypeScript Basics

**Library:** Context7 SDK
**Source:** https://context7.com/docs/ts-basics
**Retrieved:** 2025-12-13T10:30:00.000Z

---

# Introduction to TypeScript

TypeScript is a typed superset of JavaScript...
```

## Configuration

### Environment Variables

Create a `.env` file with:

```bash
# Required: Your Context7 API key
CONTEXT7_API_KEY=your_api_key_here

# Optional: Output directory (default: ./output)
OUTPUT_DIR=./output
```

### Getting a Context7 API Key

1. Visit [Context7](https://context7.com)
2. Sign up or log in
3. Navigate to API settings
4. Generate a new API key
5. Copy to your `.env` file

## Error Handling

The MVP version uses silent error handling:
- Network errors exit gracefully
- API errors exit gracefully
- File system errors exit gracefully
- Invalid input shows brief error message

Future versions will include detailed error logging and retry mechanisms.

## Context7 SDK Integration

This tool uses the Context7 TypeScript SDK:

- **Search Library**: [Documentation](https://context7.com/docs/sdks/ts/commands/search-library)
- **Get Docs**: [Documentation](https://context7.com/docs/sdks/ts/commands/get-docs)

### Current Implementation

The current code includes mock data and placeholder comments for SDK integration:

```typescript
// TODO: Replace with actual Context7 SDK call
// const results = await context7.searchLibrary(query);
```

To integrate the real SDK:

1. Ensure `@context7/sdk` is properly installed
2. Import the SDK functions
3. Replace mock data with actual API calls
4. Test with your API key

Example integration:

```typescript
import { searchLibrary as sdkSearch } from '@context7/sdk';

export async function searchLibrary(query: string) {
  const config = getConfig();
  const results = await sdkSearch(query, { apiKey: config.apiKey });
  // ... rest of implementation
}
```

## Roadmap

### Phase 1: MVP (Current)
- ✅ TypeScript project setup
- ✅ Search library command
- ✅ Get docs command
- ✅ Markdown output
- ✅ File overwrite confirmation
- ✅ Basic error handling
- 🔄 Context7 SDK integration (ready for real API)

### Phase 2: Distribution (Planned)
- [ ] npm package publication
- [ ] Installer scripts
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

## Contributing

Contributions welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Troubleshooting

### "CONTEXT7_API_KEY not found"

Make sure you've created a `.env` file with your API key:
```bash
cp .env.example .env
# Edit .env and add your API key
```

### Permission Errors

Ensure the output directory is writable:
```bash
chmod 755 output
```

### Node Version Issues

This project requires Node.js 22+. Check your version:
```bash
node --version
```

## License

MIT

## Support

For issues or questions:
- Create an issue in the repository
- Check Context7 documentation: https://context7.com/docs
- Review the MVP PRD document: `MVP_PRD.md`

---

**Built with Context7 SDK** | **TypeScript** | **Node.js 22**
