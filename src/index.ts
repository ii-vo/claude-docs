#!/usr/bin/env node

import { Command } from 'commander';
import { searchLibrary } from './commands/search-library.js';
import { getDocs } from './commands/get-docs.js';

const program = new Command();

program
  .name('context7-docs')
  .description('CLI tool for Context7 documentation workflow automation')
  .version('0.1.0');

program
  .command('search')
  .description('Search library documentation')
  .argument('<query>', 'Search query string')
  .action(async (query: string) => {
    await searchLibrary(query);
  });

program
  .command('get-docs')
  .description('Retrieve specific documentation')
  .argument('<identifier>', 'Documentation identifier')
  .action(async (identifier: string) => {
    await getDocs(identifier);
  });

program.parse();
