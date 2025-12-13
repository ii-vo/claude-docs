import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface Config {
  apiKey: string;
  outputDir: string;
}

export function getConfig(): Config {
  const apiKey = process.env.CONTEXT7_API_KEY;

  if (!apiKey) {
    console.error('Error: CONTEXT7_API_KEY not found in environment variables');
    console.error('Please create a .env file with your API key');
    process.exit(1);
  }

  return {
    apiKey,
    outputDir: process.env.OUTPUT_DIR || './output'
  };
}
