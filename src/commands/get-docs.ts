import { runCommand } from './shared.js';
import { formatMarkdownDocs } from '../utils/file-operations.js';
import type { Documentation } from '../lib/context7-sdk.js';

export async function getDocs(identifier: string): Promise<void> {
  await runCommand<Documentation>({
    input: identifier,
    inputName: 'documentation identifier',
    prefix: 'docs',
    logStart: (id) => console.log(`Retrieving documentation: "${id}"`),
    logResult: (docs) => console.log(`Retrieved: ${docs.title}`),
    execute: (sdk, id) => sdk.getDocs(id),
    format: formatMarkdownDocs
  });
}
