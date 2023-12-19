import fs from 'fs';
import path from 'path';
import readline from 'readline';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

const promptForEnvDir = async (question: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(question, envDirInput => {
      rl.close();
      resolve(envDirInput.trim());
    });
  });
};

export const loadEnvVariables = async (): Promise<void> => {
  const projectRoot = execSync('git rev-parse --show-toplevel', {
    encoding: 'utf-8',
  }).trim();
  let envPath = path.join(projectRoot, '.env.local'); // Default location

  if (!fs.existsSync(envPath)) {
    console.log(`.env.local not found at ${envPath}`);
    const envDirInput = await promptForEnvDir(
      `Enter the folder which contains .env.local, relative to '${projectRoot}', or press Enter to continue without it:\nFolder: `
    );
    envPath = envDirInput
      ? path.join(projectRoot, envDirInput, '.env.local')
      : '';
  }

  if (envPath && fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    let openAIKeyExists = false;
    for (const [key, value] of Object.entries(envConfig)) {
      if (key === 'OPENAI_API_KEY') {
        process.env[key] = value;
        openAIKeyExists = true;
      }
      process.env[`TF_VAR_${key.toLowerCase()}`] = value;
    }
    if (!openAIKeyExists) {
      const openAiKey = await promptForEnvDir(
        'OPENAI_API_KEY not found in .env.local. Please enter it below:'
      );
      process.env['OPENAI_API_KEY'] = openAiKey;
    }
    console.log(`Environment variables set for Terraform from ${envPath}`);
  } else {
    console.log('Continuing without setting environment variables.');
  }
};
