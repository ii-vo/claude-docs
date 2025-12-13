import fs from 'fs/promises';
import type { SearchResult, Documentation } from '../lib/context7-sdk.js';

export async function ensureDirectory(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function writeMarkdownFile(filePath: string, content: string): Promise<void> {
  await fs.writeFile(filePath, content, 'utf-8');
  console.log(`\u2713 File saved: ${filePath}`);
}

export function generateFilename(prefix: string, identifier: string): string {
  const sanitized = identifier
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  return `${prefix}-${sanitized}-${date}.md`;
}

export function formatMarkdownSearchResults(query: string, results: SearchResult[]): string {
  const timestamp = new Date().toISOString();
  const lines = [
    `# Search Results: ${query}`,
    '',
    `**Generated:** ${timestamp}`,
    `**Total Results:** ${results.length}`,
    '',
    '---',
    '',
    '## Results',
    ''
  ];

  for (const [i, result] of results.entries()) {
    lines.push(`### ${i + 1}. ${result.title}`);
    lines.push('');
    lines.push(`**ID:** \`${result.id}\``);
    if (result.branch) lines.push(`**Branch:** ${result.branch}`);
    if (result.stars) lines.push(`**Stars:** ${result.stars}`);
    lines.push(`**Snippets:** ${result.totalSnippets}`);
    lines.push('');
    if (result.description) lines.push(result.description);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

export function formatMarkdownDocs(docs: Documentation): string {
  const timestamp = new Date().toISOString();
  const lines = [
    `# ${docs.title}`,
    '',
    `**ID:** \`${docs.id}\``,
    `**Retrieved:** ${timestamp}`,
    `**Total Tokens:** ${docs.totalTokens}`,
    `**Snippets:** ${docs.snippets.length}`,
    '',
    '---',
    ''
  ];

  if (docs.content) lines.push(docs.content);

  return lines.join('\n');
}
