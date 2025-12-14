#!/usr/bin/env node
import { Command } from 'commander';
import prompts from 'prompts';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Templates directory is at ../templates relative to compiled dist/index.js
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

const CONTEXT7_MCP_URL = 'https://mcp.context7.com/mcp';

interface ScaffoldOptions {
  skipMcp?: boolean;
}

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Markers for the documentation section in CLAUDE.md/AGENTS.md
const DOCS_SECTION_START = '<!-- CLAUDE_DOCS_START -->';
const DOCS_SECTION_END = '<!-- CLAUDE_DOCS_END -->';

function generateDocsSection(): string {
  return `${DOCS_SECTION_START}
## Library Documentation via Context7

This project uses [Context7](https://context7.com) MCP server for up-to-date library documentation lookup. The documentation system is configured automatically and provides specialized research agents for your project's dependencies.

### How to Use

1. **Run \`/sync-docs\`** to scan dependencies and generate library-specific research agents
2. **Use \`/research <topic>\`** to route questions to the appropriate documentation agent
3. **Use \`@research-<library>\`** to directly query a specific library's documentation

### Available Commands

| Command | Description |
|---------|-------------|
| \`/sync-docs\` | Scan dependencies and create/update library research agents |
| \`/research <query>\` | Route questions to appropriate documentation agents |

### Context7 MCP Tools

The Context7 MCP server provides these tools:

| Tool | Purpose |
|------|---------|
| \`resolve-library-id\` | Convert package name to Context7 library ID |
| \`get-library-docs\` | Retrieve documentation for a library |

### Notes

- Documentation agents are generated in \`.claude/agents/research-<library>.md\`
- Run \`/sync-docs\` after adding new dependencies to create their research agents
- If a library is not available in Context7, it will be skipped during sync
${DOCS_SECTION_END}`;
}

function findDocumentationFile(): string | null {
  const cwd = process.cwd();
  const candidates = ['CLAUDE.md', 'AGENTS.md'];

  for (const candidate of candidates) {
    const filePath = path.join(cwd, candidate);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  return null;
}

function updateDocumentationFile(filePath: string): { updated: boolean; created: boolean; error?: string } {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const docsSection = generateDocsSection();

    // Check if section already exists
    const startIdx = content.indexOf(DOCS_SECTION_START);
    const endIdx = content.indexOf(DOCS_SECTION_END);

    let newContent: string;

    if (startIdx !== -1 && endIdx !== -1) {
      // Replace existing section
      newContent = content.substring(0, startIdx) + docsSection + content.substring(endIdx + DOCS_SECTION_END.length);
    } else {
      // Append section at the end
      newContent = content.trimEnd() + '\n\n' + docsSection + '\n';
    }

    fs.writeFileSync(filePath, newContent, 'utf-8');
    return { updated: true, created: false };
  } catch (error) {
    return {
      updated: false,
      created: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function copyFile(src: string, dest: string): void {
  const content = fs.readFileSync(src, 'utf-8');
  fs.writeFileSync(dest, content, 'utf-8');
}

async function promptForApiKey(): Promise<string | null> {
  console.log('Get your API key at: https://context7.com/dashboard\n');

  const response = await prompts({
    type: 'password',
    name: 'apiKey',
    message: 'Context7 API Key (optional, increases rate limits):',
  });

  return response.apiKey || null;
}

function configureContext7Mcp(apiKey: string | null): { success: boolean; error?: string } {
  // Clean the API key (remove whitespace/newlines)
  const cleanKey = apiKey?.trim() || null;

  // Build the claude mcp add command args
  const args = [
    'mcp', 'add',
    '--transport', 'http',
    '--scope', 'project',
    'context7',
    CONTEXT7_MCP_URL,
  ];

  // Add API key header if provided
  if (cleanKey) {
    args.push('--header', `CONTEXT7_API_KEY: ${cleanKey}`);
  }

  // Try to add MCP server
  let result = spawnSync('claude', args, { stdio: 'pipe', encoding: 'utf-8' });

  if (result.status === 0) {
    return { success: true };
  }

  // MCP might already exist, try to remove and re-add
  const removeResult = spawnSync('claude', ['mcp', 'remove', '--scope', 'project', 'context7'], {
    stdio: 'pipe',
    encoding: 'utf-8'
  });

  if (removeResult.status === 0) {
    result = spawnSync('claude', args, { stdio: 'pipe', encoding: 'utf-8' });
    if (result.status === 0) {
      return { success: true };
    }
  }

  return {
    success: false,
    error: result.error?.message || result.stderr || result.stdout || `Exit code: ${result.status}`
  };
}

async function scaffold(options: ScaffoldOptions): Promise<void> {
  const targetDir = path.join(process.cwd(), '.claude');
  const commandsDir = path.join(targetDir, 'commands');
  const agentsDir = path.join(targetDir, 'agents');

  console.log('\nclaude-docs - Claude Code Research Workflow\n');

  // Configure Context7 MCP server unless skipped
  if (!options.skipMcp) {
    const apiKey = await promptForApiKey();

    console.log('[...] Configuring Context7 MCP server...');
    const result = configureContext7Mcp(apiKey);

    if (result.success) {
      console.log(`[ok] Context7 MCP configured${apiKey?.trim() ? ' with API key' : ''}`);
    } else {
      console.log('[warn] Could not configure Context7 MCP automatically');
      if (result.error) {
        console.log(`       Error: ${result.error}`);
      }
      console.log('       Run manually: claude mcp add --transport http --scope project context7 ' + CONTEXT7_MCP_URL);
    }
  }

  // Create directories
  ensureDir(commandsDir);
  ensureDir(agentsDir);

  // Copy command templates
  const commandTemplates = ['sync-docs.md', 'research.md'];
  for (const template of commandTemplates) {
    const src = path.join(TEMPLATES_DIR, 'commands', template);
    const dest = path.join(commandsDir, template);

    if (fs.existsSync(src)) {
      copyFile(src, dest);
      console.log(`[ok] Created ${path.relative(process.cwd(), dest)}`);
    } else {
      console.error(`[error] Template not found: ${template}`);
    }
  }

  // Copy base agent templates
  const agentTemplates = [
    'codebase-locator.md',
    'codebase-analyzer.md',
    'codebase-pattern-finder.md',
    'web-search-researcher.md',
  ];

  for (const template of agentTemplates) {
    const src = path.join(TEMPLATES_DIR, 'agents', template);
    const dest = path.join(agentsDir, template);

    if (fs.existsSync(src)) {
      copyFile(src, dest);
      console.log(`[ok] Created ${path.relative(process.cwd(), dest)}`);
    } else {
      console.error(`[error] Template not found: ${template}`);
    }
  }

  // Update CLAUDE.md or AGENTS.md if present
  const docFile = findDocumentationFile();
  if (docFile) {
    const result = updateDocumentationFile(docFile);
    const fileName = path.basename(docFile);
    if (result.updated) {
      console.log(`[ok] Updated ${fileName} with documentation section`);
    } else if (result.error) {
      console.log(`[warn] Could not update ${fileName}: ${result.error}`);
    }
  }

  console.log('\nDone! Now run: claude /sync-docs\n');
}

// CLI setup
const program = new Command();

program
  .name('claude-docs')
  .description('Claude Code research workflow tool - auto-configures library-specific sub-agents via Context7')
  .version('1.0.4')
  .option('--skip-mcp', 'Skip Context7 MCP configuration')
  .action(async (options: ScaffoldOptions) => {
    try {
      await scaffold(options);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
