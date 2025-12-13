import prompts from 'prompts';

export async function confirmOverwrite(filePath: string): Promise<boolean> {
  console.log(`\nFile already exists: ${filePath}`);

  const response = await prompts({
    type: 'confirm',
    name: 'overwrite',
    message: 'Overwrite?',
    initial: false
  });

  // Handle Ctrl+C gracefully
  if (response.overwrite === undefined) {
    console.log('\nOperation cancelled');
    return false;
  }

  return response.overwrite;
}
