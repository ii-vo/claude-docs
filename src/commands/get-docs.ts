import path from 'path';
import { getConfig } from '../config/context7-config.js';
import {
  ensureDirectory,
  fileExists,
  writeMarkdownFile,
  generateFilename,
  formatMarkdownDocs
} from '../utils/file-operations.js';
import { confirmOverwrite } from '../utils/prompt.js';
import { createContext7SDK } from '../lib/context7-sdk-mock.js';

export async function getDocs(identifier: string): Promise<void> {
  if (!identifier || identifier.trim() === '') {
    console.error('Error: Please provide a documentation identifier');
    process.exit(1);
  }

  console.log(`Retrieving documentation: "${identifier}"`);

  try {
    const config = getConfig();

    // Initialize SDK with API key
    const sdk = createContext7SDK(config.apiKey);

    // Get documentation
    const docs = await sdk.getDocs(identifier);

    console.log(`Retrieved: ${docs.title}`);

    // Generate markdown content
    const markdown = formatMarkdownDocs(docs);

    // Ensure output directory exists
    await ensureDirectory(config.outputDir);

    // Generate filename
    const filename = generateFilename('docs', identifier, true);
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
