import path from 'path';
import { getConfig, Config } from '../config/context7-config.js';
import {
  ensureDirectory,
  fileExists,
  writeMarkdownFile,
  generateFilename
} from '../utils/file-operations.js';
import { confirmOverwrite } from '../utils/prompt.js';
import { Context7SDK } from '../lib/context7-sdk.js';

interface CommandOptions<T> {
  input: string;
  inputName: string;
  prefix: string;
  logStart: (input: string) => void;
  logResult: (result: T) => void;
  execute: (sdk: Context7SDK, input: string) => Promise<T>;
  format: (result: T) => string;
}

export async function runCommand<T>(options: CommandOptions<T>): Promise<void> {
  const { input, inputName, prefix, logStart, logResult, execute, format } = options;

  if (!input?.trim()) {
    console.error(`Error: Please provide a ${inputName}`);
    process.exit(1);
  }

  logStart(input);

  const config = getConfig();
  const sdk = new Context7SDK({ apiKey: config.apiKey });

  const result = await execute(sdk, input);
  logResult(result);

  const markdown = format(result);
  await saveMarkdown(config, prefix, input, markdown);
}

async function saveMarkdown(
  config: Config,
  prefix: string,
  identifier: string,
  content: string
): Promise<void> {
  await ensureDirectory(config.outputDir);

  const filename = generateFilename(prefix, identifier);
  const filePath = path.join(config.outputDir, filename);

  if (await fileExists(filePath)) {
    if (!await confirmOverwrite(filePath)) {
      console.log('Operation cancelled');
      process.exit(0);
    }
  }

  await writeMarkdownFile(filePath, content);
}
