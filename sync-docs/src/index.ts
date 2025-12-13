#!/usr/bin/env node

import { Command } from 'commander';
import prompts from 'prompts';
import { writeFile, mkdir, copyFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

program
  .name('sync-docs')
  .description('Claude Code research workflow tool - scaffolds library research agents')
  .version('1.0.0')
  .option('-g, --global', 'Install to ~/.claude/ instead of project')
  .option('--skip-key', 'Skip API key prompt')
  .option('-h, --help', 'Show help')
  .parse(process.argv);

const options = program.opts();

async function main() {
  console.log('🔧 sync-docs - Setting up Claude Code research workflow\n');

  // Determine target directory
  const targetDir = options.global
    ? join(homedir(), '.claude')
    : join(process.cwd(), '.claude');

  const commandsDir = join(targetDir, 'commands');
  const agentsDir = join(targetDir, 'agents');

  // Create directories
  await mkdir(commandsDir, { recursive: true });
  await mkdir(agentsDir, { recursive: true });

  // API Key prompt (unless --skip-key)
  if (!options.skipKey) {
    const response = await prompts({
      type: 'password',
      name: 'apiKey',
      message: 'Enter Context7 API Key (optional, press Enter to skip):',
      validate: (value) => true // Optional field
    });

    if (response.apiKey && response.apiKey.trim()) {
      const envPath = options.global
        ? join(homedir(), '.env')
        : join(process.cwd(), '.env');

      const envContent = `CONTEXT7_API_KEY=${response.apiKey.trim()}\n`;
      await writeFile(envPath, envContent, { flag: 'a' });
      console.log(`✓ API key saved to ${envPath}\n`);
    }
  }

  // Get template source directory (from npm package or local dev)
  const templatesSourceDir = join(__dirname, '..', 'templates');

  // Copy slash command templates
  const commandFiles = ['sync-docs.md', 'research.md'];
  for (const file of commandFiles) {
    const sourcePath = join(templatesSourceDir, 'commands', file);
    const targetPath = join(commandsDir, file);

    if (existsSync(sourcePath)) {
      await copyFile(sourcePath, targetPath);
      console.log(`✓ Created .claude/commands/${file}`);
    } else {
      console.warn(`⚠ Template not found: ${sourcePath}`);
    }
  }

  // Copy base agent templates
  const agentFiles = [
    'codebase-locator.md',
    'codebase-analyzer.md',
    'codebase-pattern-finder.md',
    'web-search-researcher.md'
  ];

  for (const file of agentFiles) {
    const sourcePath = join(templatesSourceDir, 'agents', file);
    const targetPath = join(agentsDir, file);

    if (existsSync(sourcePath)) {
      await copyFile(sourcePath, targetPath);
      console.log(`✓ Created .claude/agents/${file}`);
    } else {
      console.warn(`⚠ Template not found: ${sourcePath}`);
    }
  }

  console.log('\n✅ Setup complete!');
  console.log('\nNext steps:');
  console.log('  1. Open Claude Code in this project');
  console.log('  2. Run /sync-docs to generate library-specific agents');
  console.log('  3. Use @research-{library} or /research for documentation queries\n');
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
