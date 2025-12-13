# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Context7 Documentation Tool - A TypeScript CLI that integrates with Context7's SDK to search library documentation and retrieve specific docs, outputting results to static markdown files.

**Status**: MVP complete with mock SDK (ready for real SDK integration when @context7/sdk becomes available)

## Commands

```bash
# Development
npm run dev -- search "query"        # Run search command
npm run dev -- get-docs "id"         # Run get-docs command
npm run typecheck                    # Type check without emit

# Production
npm run build                        # Compile to dist/
npm start search "query"             # Run compiled search
npm start get-docs "id"              # Run compiled get-docs
```

No test or lint commands are configured.

## Architecture

**CLI Framework**: Commander.js with two commands (`search`, `get-docs`)

**Module Structure**:
- `src/index.ts` - CLI entry point, command routing
- `src/commands/` - Command handlers (search-library.ts, get-docs.ts)
- `src/utils/file-operations.ts` - Markdown formatting and file I/O
- `src/utils/prompt.ts` - Interactive user prompts (file overwrite confirmation)
- `src/config/context7-config.ts` - Environment/configuration loading
- `src/lib/context7-sdk-mock.ts` - Mock SDK implementation

**Data Flow**: User Input → Commander → Command Handler → SDK → File Operations → `output/` directory

**Output Files**: Timestamped markdown in `output/` (e.g., `search-query-2024-01-15.md`)

## Technology

- TypeScript 5.6 with strict mode, ES2022 target, ESNext modules
- Node.js 22+ required
- Dependencies: commander, prompts, dotenv
- Dev execution: tsx

## Environment

Required in `.env`:
```
CONTEXT7_API_KEY=your_key
OUTPUT_DIR=./output  # optional
```

## SDK Integration

The mock SDK (`src/lib/context7-sdk-mock.ts`) is structured to match the real Context7 SDK API. When @context7/sdk is available:
1. Install: `npm install @context7/sdk`
2. Replace mock imports in command files
3. Update SDK initialization

## Documentation

- `QUICKSTART.md` - 5-minute setup
- `PROJECT_README.md` - Complete usage guide
- `IMPLEMENTATION_SUMMARY.md` - Technical details
- `MVP_PRD.md` - Full product requirements (~2,800 lines)
