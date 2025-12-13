import fs from 'fs/promises';
import { existsSync } from 'fs';

export async function ensureDirectory(dirPath: string): Promise<void> {
  try {
    if (!existsSync(dirPath)) {
      await fs.mkdir(dirPath, { recursive: true });
    }
  } catch (error) {
    // Silent skip on error (MVP behavior)
    process.exit(1);
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function writeMarkdownFile(
  filePath: string,
  content: string
): Promise<void> {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    console.log(`✓ File saved successfully: ${filePath}`);
  } catch (error) {
    // Silent skip on error (MVP behavior)
    process.exit(1);
  }
}

export function generateFilename(
  prefix: string,
  identifier: string,
  includeTimestamp: boolean = true
): string {
  const sanitized = identifier
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const timestamp = includeTimestamp
    ? `-${new Date().toISOString().split('T')[0].replace(/-/g, '')}`
    : '';

  return `${prefix}-${sanitized}${timestamp}.md`;
}

export function formatMarkdownSearchResults(query: string, results: any[]): string {
  const timestamp = new Date().toISOString();

  let markdown = `# Search Results: ${query}\n\n`;
  markdown += `**Generated:** ${timestamp}\n`;
  markdown += `**Total Results:** ${results.length}\n\n`;
  markdown += `---\n\n`;
  markdown += `## Results\n\n`;

  results.forEach((result, index) => {
    markdown += `### ${index + 1}. ${result.title || 'Untitled'}\n\n`;
    if (result.library) markdown += `**Library:** ${result.library}\n`;
    if (result.url) markdown += `**URL:** ${result.url}\n`;
    markdown += `\n`;
    if (result.snippet) markdown += `${result.snippet}\n`;
    markdown += `\n---\n\n`;
  });

  return markdown;
}

export function formatMarkdownDocs(docs: any): string {
  const timestamp = new Date().toISOString();

  let markdown = `# ${docs.title || 'Documentation'}\n\n`;
  if (docs.library) markdown += `**Library:** ${docs.library}\n`;
  if (docs.url) markdown += `**Source:** ${docs.url}\n`;
  markdown += `**Retrieved:** ${timestamp}\n\n`;
  markdown += `---\n\n`;

  if (docs.content) {
    markdown += `${docs.content}\n`;
  }

  return markdown;
}
