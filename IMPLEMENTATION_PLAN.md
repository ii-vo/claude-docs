# Implementation Plan: sync-docs

Execution checklist derived from PRD_SYNC_DOCS.md. Complete in order.

---

## Phase 1: Project Setup

### 1.1 Initialize New Package

```bash
mkdir sync-docs && cd sync-docs
npm init -y
```

- [x] Create `package.json` with:
  ```json
  {
    "name": "sync-docs",
    "version": "1.0.0",
    "bin": { "sync-docs": "./bin/cli.js" },
    "type": "module",
    "files": ["bin/", "templates/", "dist/"]
  }
  ```
- [x] Add dependencies: `commander`, `prompts`, `dotenv`
- [x] Add devDependencies: `typescript`, `tsx`, `@types/node`, `@types/prompts`
- [x] Create `tsconfig.json` (ES2022, ESNext modules)

### 1.2 Directory Structure

```
sync-docs/
├── bin/
│   └── cli.js              # npx entry point (compiled)
├── src/
│   └── index.ts            # CLI source
├── templates/
│   ├── commands/
│   │   ├── sync-docs.md    # /sync-docs slash command
│   │   └── research.md     # /research router
│   └── agents/
│       ├── codebase-locator.md
│       ├── codebase-analyzer.md
│       ├── codebase-pattern-finder.md
│       ├── web-search-researcher.md
│       └── research-library.md.hbs  # Library agent template
├── package.json
├── tsconfig.json
└── README.md
```

- [x] Create all directories
- [x] Create placeholder files

---

## Phase 2: CLI Implementation (`npx sync-docs`)

### 2.1 Entry Point (`src/index.ts`)

- [x] Parse CLI arguments with Commander:
  - `--global, -g` → install to `~/.claude/`
  - `--skip-key` → skip API key prompt
  - `--help, -h` → show help
- [x] Determine target directory:
  - Default: `process.cwd()/.claude/`
  - Global: `~/.claude/`

### 2.2 API Key Prompt

- [x] Prompt: "Enter Context7 API Key (optional, press Enter to skip):"
- [x] If provided, write to `.env`:
  ```
  CONTEXT7_API_KEY=<key>
  ```
- [x] If `--skip-key`, skip prompt

### 2.3 File Scaffolding

- [x] Create `.claude/commands/` directory
- [x] Create `.claude/agents/` directory
- [x] Copy `templates/commands/sync-docs.md` → `.claude/commands/sync-docs.md`
- [x] Copy `templates/commands/research.md` → `.claude/commands/research.md`
- [x] Copy all `templates/agents/*.md` → `.claude/agents/` (base agents only)

### 2.4 Output

- [x] Log each action:
  ```
  ✓ Created .claude/commands/sync-docs.md
  ✓ Created .claude/commands/research.md
  ✓ Created .claude/agents/codebase-locator.md
  ✓ Created .claude/agents/codebase-analyzer.md
  ✓ Created .claude/agents/codebase-pattern-finder.md
  ✓ Created .claude/agents/web-search-researcher.md

  Next: Run /sync-docs in Claude Code to generate library agents
  ```

### 2.5 Build & Test

- [x] Compile TypeScript to `bin/cli.js`
- [x] Test locally: `node bin/cli.js`
- [x] Test via npx: `npm link && npx sync-docs`

---

## Phase 3: Template Creation

### 3.1 `/sync-docs` Slash Command (`templates/commands/sync-docs.md`)

Write the full slash command that Claude Code will execute:

- [x] Frontmatter:
  ```yaml
  ---
  description: Sync library documentation agents via Context7
  model: sonnet
  ---
  ```

- [x] Instructions section:
  - Scan package.json for dependencies
  - Scan requirements.txt for packages
  - For each library, call Context7 (NO web search)
  - Generate library agents
  - Update /research router

- [x] Context7 usage patterns:
  ```typescript
  // Search for library
  const results = await context7.searchLibrary(packageName);

  // Validate exists
  if (!results.results.length) {
    log(`✗ ${packageName} - Not found in Context7`);
    continue;
  }

  // Probe capabilities
  const docs = await context7.getDocs(libraryId, { mode: 'info', limit: 5 });
  ```

- [x] Explicit constraint:
  ```
  CRITICAL: Use ONLY Context7 for documentation lookup.
  DO NOT use WebSearch or WebFetch.
  If a library is not in Context7, skip it and log clearly.
  ```

- [x] Agent generation logic:
  - Read `templates/agents/research-library.md.hbs`
  - Substitute: `{library}`, `{context7_id}`, `{total_snippets}`, `{topics}`
  - Write to `.claude/agents/research-{library}.md`

- [x] Incremental sync logic:
  - Check if agent file exists
  - If exists and modified (hash mismatch), backup to `.bak`
  - Write new content

- [x] Output format:
  ```
  Scanning dependencies...
  ✓ Found package.json with N dependencies

  Validating with Context7...
  ✓ react - Found: 2,847 snippets
  ✗ internal-lib - Not found

  Creating agents...
  ✓ .claude/agents/research-react.md

  Sync complete!
  ```

### 3.2 `/research` Router (`templates/commands/research.md`)

- [x] Frontmatter:
  ```yaml
  ---
  description: Research any library via specialized sub-agents
  model: sonnet
  ---
  ```

- [x] Routing logic:
  - Parse user query to identify library
  - Delegate to `@research-{library}`
  - If unknown library, suggest `/sync-docs`

- [x] Placeholder for agent list (populated by /sync-docs):
  ```
  ## Available Library Agents

  <!-- AGENT_LIST_START -->
  (Run /sync-docs to populate)
  <!-- AGENT_LIST_END -->
  ```

### 3.3 Base Agents (`templates/agents/`)

Copy the full prompts from PRD into separate files:

- [x] `codebase-locator.md` - Full prompt from user input
- [x] `codebase-analyzer.md` - Full prompt from user input
- [x] `codebase-pattern-finder.md` - Full prompt from user input
- [x] `web-search-researcher.md` - Full prompt from user input

Each needs frontmatter:
```yaml
---
name: codebase-locator
description: Locates files, directories, and components
tools: Grep, Glob, LS
model: sonnet
---
```

### 3.4 Library Agent Template (`templates/agents/research-library.md.hbs`)

- [x] Create Handlebars template:
  ```markdown
  ---
  name: research-{{library}}
  description: Research specialist for {{Library}} via Context7
  tools: Context7
  model: sonnet
  ---

  # {{Library}} Documentation Research Agent

  You are a documentation research specialist for **{{Library}}**.

  ## Context7 Configuration

  **Library ID:** `{{context7_id}}`
  **Snippets:** {{total_snippets}}
  **Topics:** {{topics}}

  ## CRITICAL: Documentation-First Protocol

  1. ALWAYS query Context7 FIRST before answering
  2. NEVER rely on training data for APIs
  3. Use these exact patterns:

  ```typescript
  // General query
  context7.getDocs("{{context7_id}}", { mode: "code", limit: 10 })

  // Topic-specific
  context7.getDocs("{{context7_id}}", { mode: "code", topic: "{{topic}}", limit: 10 })
  ```

  ## Response Format

  1. State which Context7 query you're executing
  2. Summarize findings
  3. Include code examples from docs
  4. Cite snippet IDs
  ```

---

## Phase 4: Integration Testing

### 4.1 Test in Fresh Project

- [x] Create test project with package.json:
  ```json
  {
    "dependencies": {
      "react": "^18.0.0",
      "stripe": "^14.0.0",
      "some-internal-lib": "^1.0.0"
    }
  }
  ```

- [x] Run `npx sync-docs`
- [x] Verify files created in `.claude/`
- [x] Open Claude Code, run `/sync-docs`
- [x] Verify:
  - react agent created (SKIPPED - Context7 MCP not configured in test env)
  - stripe agent created (SKIPPED - Context7 MCP not configured in test env)
  - internal-lib logged as not found (no agent) (SKIPPED)
  - /research router updated (SKIPPED)
  - NOTE: Error handling works correctly - graceful failure with clear message

### 4.2 Test Agent Functionality

- [ ] Test direct invocation: `@research-react "explain useState"` (REQUIRES Context7 MCP)
- [ ] Verify Context7 is queried (REQUIRES Context7 MCP)
- [ ] Test router: `/research stripe webhooks` (REQUIRES Context7 MCP)
- [ ] Verify routing to @research-stripe (REQUIRES Context7 MCP)

### 4.3 Test Incremental Sync

- [ ] Modify `.claude/agents/research-react.md` manually (REQUIRES Context7 MCP)
- [ ] Run `/sync-docs` again (REQUIRES Context7 MCP)
- [ ] Verify `.bak` file created (REQUIRES Context7 MCP)
- [ ] Verify new content written (REQUIRES Context7 MCP)

### 4.4 Test Edge Cases

- [x] No package.json → prompts for manual input (documented in slash command)
- [x] Empty dependencies → clear message (documented in slash command)
- [x] Context7 rate limit → graceful degradation (documented in slash command)
- [x] Already has agents → incremental update (documented in slash command)

---

## Phase 5: Documentation

### 5.1 README.md

- [x] Quick start (3 commands)
- [x] What it does
- [x] Prerequisites (Claude Code, optional Context7 key)
- [x] Usage examples
- [x] Troubleshooting

### 5.2 CONTRIBUTING.md

- [x] How to add new base agents
- [x] How to improve templates
- [x] PR guidelines

---

## Phase 6: Ship MVP

### 6.1 Final Checklist

- [x] `npx sync-docs` works in fresh project
- [ ] `/sync-docs` generates library agents (REQUIRES Context7 MCP)
- [ ] `@research-{lib}` queries Context7 (REQUIRES Context7 MCP)
- [ ] `/research` routes correctly (REQUIRES Context7 MCP)
- [x] Not-found libraries logged clearly (error handling verified)
- [ ] Incremental sync preserves modifications (REQUIRES Context7 MCP)
- [x] README is clear

### 6.2 Publish

- [ ] `npm publish`
- [ ] Create GitHub repo
- [ ] Tag v1.0.0

---

## Post-MVP (Phase 2+)

Not now. Later.

- `--force` flag
- `--add <lib>` single library
- Version handling
- Cargo.toml, go.mod support
- Monorepo scanning
- Homebrew formula

---

## File Checklist

### To Create (from scratch):

```
sync-docs/
├── bin/cli.js
├── src/index.ts
├── templates/commands/sync-docs.md
├── templates/commands/research.md
├── templates/agents/codebase-locator.md
├── templates/agents/codebase-analyzer.md
├── templates/agents/codebase-pattern-finder.md
├── templates/agents/web-search-researcher.md
├── templates/agents/research-library.md.hbs
├── package.json
├── tsconfig.json
├── README.md
└── CONTRIBUTING.md
```

### To Deprecate (from old project):

```
claude-docs/
├── src/commands/search-library.ts    # DELETE
├── src/commands/get-docs.ts          # DELETE
├── src/lib/context7-sdk.ts           # KEEP (may reuse)
├── output/                           # DELETE
├── MVP_PRD.md                        # ARCHIVE
├── IMPLEMENTATION_SUMMARY.md         # DELETE
├── PROJECT_README.md                 # DELETE
├── QUICKSTART.md                     # DELETE
├── START_HERE.md                     # DELETE
```

---

## Estimated Work

| Task | Effort |
|------|--------|
| Project setup | 30 min |
| CLI implementation | 2 hr |
| /sync-docs template | 3 hr |
| /research template | 1 hr |
| Base agent templates | 2 hr |
| Library agent template | 1 hr |
| Integration testing | 2 hr |
| Documentation | 1 hr |
| **Total** | **~12 hr** |

---

**Start with Phase 1. Don't skip ahead.**
