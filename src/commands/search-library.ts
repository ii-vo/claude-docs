import { runCommand } from './shared.js';
import { formatMarkdownSearchResults } from '../utils/file-operations.js';
import type { SearchResult } from '../lib/context7-sdk.js';

export async function searchLibrary(query: string): Promise<void> {
  await runCommand<SearchResult[]>({
    input: query,
    inputName: 'search query',
    prefix: 'search',
    logStart: (q) => console.log(`Searching for: "${q}"`),
    logResult: (results) => console.log(`Found ${results.length} result(s)...`),
    execute: (sdk, q) => sdk.searchLibrary(q),
    format: (results) => formatMarkdownSearchResults(query, results)
  });
}
