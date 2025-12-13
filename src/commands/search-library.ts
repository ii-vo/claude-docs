import path from 'path';
import { getConfig } from '../config/context7-config.js';
import {
  ensureDirectory,
  fileExists,
  writeMarkdownFile,
  generateFilename,
  formatMarkdownSearchResults
} from '../utils/file-operations.js';
import { confirmOverwrite } from '../utils/prompt.js';
import { createContext7SDK } from '../lib/context7-sdk-mock.js';

export async function searchLibrary(query: string): Promise<void> {
  if (!query || query.trim() === '') {
    console.error('Error: Please provide a search query');
    process.exit(1);
  }

  console.log(`Searching for: "${query}"`);

  try {
    const config = getConfig();

    // Initialize SDK with API key
    const sdk = createContext7SDK(config.apiKey);

    // Search library documentation
    const results = await sdk.searchLibrary(query);

    console.log(`Found ${results.length} result(s)...`);

    // Generate markdown content
    const markdown = formatMarkdownSearchResults(query, results);

    // Ensure output directory exists
    await ensureDirectory(config.outputDir);

    // Generate filename
    const filename = generateFilename('search', query, true);
    const filePath = path.join(config.outputDir, filename);

    // Check if file exists and prompt for confirmation
    if (await fileExists(filePath)) {
      const shouldOverwrite = await confirmOverwrite(filePath);
      if (!shouldOverwrite) {
        console.log('Operation cancelled');
        process.exit(0);
      }
    }

    // Write file
    await writeMarkdownFile(filePath, markdown);

  } catch (error) {
    // Silent skip on error (MVP behavior)
    process.exit(1);
  }
}
