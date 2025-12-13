#!/usr/bin/env node
import { Command } from 'commander';
import prompts from 'prompts';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Templates directory is at ../templates relative to compiled dist/index.js
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

interface ScaffoldOptions {
  global?: boolean;
  skipKey?: boolean;
}

function getTargetDir(options: ScaffoldOptions): string {
  if (options.global) {
    const homeDir = process.env.HOME || process.env.USERPROFILE || '';
    return path.join(homeDir, '.claude');
  }
  return path.join(process.cwd(), '.claude');
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
    message: 'Enter Context7 API Key (optional, press Enter to skip):',
  });

  return response.apiKey || null;
}

function writeEnvFile(apiKey: string, targetDir: string): void {
  const envPath = path.join(path.dirname(targetDir), '.env');
  let envContent = '';

  // Read existing .env if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');
    // Check if CONTEXT7_API_KEY already exists
    if (envContent.includes('CONTEXT7_API_KEY=')) {
      // Update existing key
      envContent = envContent.replace(
        /CONTEXT7_API_KEY=.*/,
        `CONTEXT7_API_KEY=${apiKey}`
      );
    } else {
      // Append new key
      envContent = envContent.trim() + `\nCONTEXT7_API_KEY=${apiKey}\n`;
    }
  } else {
    envContent = `CONTEXT7_API_KEY=${apiKey}\n`;
  }

  fs.writeFileSync(envPath, envContent, 'utf-8');
}

async function scaffold(options: ScaffoldOptions): Promise<void> {
  const targetDir = getTargetDir(options);
  const commandsDir = path.join(targetDir, 'commands');
  const agentsDir = path.join(targetDir, 'agents');

  console.log('\n sync-docs - Claude Code Research Workflow\n');

  // Prompt for API key unless skipped
  if (!options.skipKey) {
    const apiKey = await promptForApiKey();
    if (apiKey) {
      writeEnvFile(apiKey, targetDir);
      console.log('\n API key saved to .env');
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
      console.log(` Created ${path.relative(process.cwd(), dest)}`);
    } else {
      console.error(` Template not found: ${template}`);
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
      console.log(` Created ${path.relative(process.cwd(), dest)}`);
    } else {
      console.error(` Template not found: ${template}`);
    }
  }

  console.log('\n Setup complete!\n');
  console.log(' Next: Run /sync-docs in Claude Code to generate library agents\n');
}

// CLI setup
const program = new Command();

program
  .name('sync-docs')
  .description('Claude Code research workflow tool - auto-configures library-specific sub-agents via Context7')
  .version('1.0.0')
  .option('-g, --global', 'Install to ~/.claude/ instead of project')
  .option('--skip-key', 'Skip API key prompt')
  .action(async (options: ScaffoldOptions) => {
    try {
      await scaffold(options);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
