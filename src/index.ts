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

function copyFile(src: string, dest: string): void {
  const content = fs.readFileSync(src, 'utf-8');
  fs.writeFileSync(dest, content, 'utf-8');
}

async function promptForApiKey(): Promise<string | null> {
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
