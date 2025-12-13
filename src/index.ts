#!/usr/bin/env node

import { Command } from 'commander';
import prompts from 'prompts';
import { writeFileSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

program
  .name('sync-docs')
  .description('Claude Code research workflow tool - auto-configure library-specific sub-agents')
  .version('1.0.0')
  .option('-g, --global', 'Install to ~/.claude/ instead of project directory')
  .option('--skip-key', 'Skip API key prompt')
  .parse();

const options = program.opts();

async function main() {
  console.log('🚀 sync-docs - Setting up Claude Code research workflow\n');

  // Determine target directory
  const targetDir = options.global 
    ? join(homedir(), '.claude')
    : join(process.cwd(), '.claude');

  console.log(`📁 Target directory: ${targetDir}\n`);

  // API Key prompt (unless --skip-key)
  let apiKey = '';
  if (!options.skipKey) {
    const response = await prompts({
      type: 'password',
      name: 'apiKey',
      message: 'Enter Context7 API Key (optional, press Enter to skip):',
      validate: () => true // Allow empty
    });

    apiKey = response.apiKey || '';
  }

  // Create directory structure
  const commandsDir = join(targetDir, 'commands');
  const agentsDir = join(targetDir, 'agents');

  mkdirSync(commandsDir, { recursive: true });
  mkdirSync(agentsDir, { recursive: true });

  // Write .env file if API key provided
  if (apiKey) {
    const envPath = join(targetDir, '.env');
    writeFileSync(envPath, `CONTEXT7_API_KEY=${apiKey}\n`);
    console.log('✓ API key saved to .env');
  }

  // Get templates directory (relative to compiled dist/index.js)
  const templatesDir = join(__dirname, '..', 'templates');

  // Copy command templates
  const syncDocsTemplate = join(templatesDir, 'commands', 'sync-docs.md');
  const researchTemplate = join(templatesDir, 'commands', 'research.md');

  if (existsSync(syncDocsTemplate)) {
    copyFileSync(syncDocsTemplate, join(commandsDir, 'sync-docs.md'));
    console.log('✓ Created .claude/commands/sync-docs.md');
  } else {
    console.log('⚠ Warning: sync-docs.md template not found');
  }

  if (existsSync(researchTemplate)) {
    copyFileSync(researchTemplate, join(commandsDir, 'research.md'));
    console.log('✓ Created .claude/commands/research.md');
  } else {
    console.log('⚠ Warning: research.md template not found');
  }

  // Copy base agent templates
  const baseAgents = [
    'codebase-locator.md',
    'codebase-analyzer.md',
    'codebase-pattern-finder.md',
    'web-search-researcher.md'
  ];

  for (const agent of baseAgents) {
    const agentPath = join(templatesDir, agent);
    if (existsSync(agentPath)) {
      copyFileSync(agentPath, join(agentsDir, agent));
      console.log(`✓ Created .claude/agents/${agent}`);
    } else {
      console.log(`⚠ Warning: ${agent} template not found`);
    }
  }

  // Copy library agent template
  const libraryTemplate = join(templatesDir, 'research-library.md.hbs');
  if (existsSync(libraryTemplate)) {
    copyFileSync(libraryTemplate, join(agentsDir, 'research-library.md.hbs'));
    console.log('✓ Created .claude/agents/research-library.md.hbs');
  }

  console.log('\n✅ Setup complete!\n');
  console.log('Next steps:');
  console.log('1. Open your project in Claude Code');
  console.log('2. Run /sync-docs to generate library-specific agents');
  console.log('3. Use @research-{library} or /research to query documentation\n');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
