// loadEnvVariables.ts
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

const promptForEnvDir = async (projectRoot: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(
      `Enter the folder which contains .env.local, relative to '${projectRoot}', or press Enter to continue without it:\nFolder: `,
      envDirInput => {
        rl.close();
        resolve(envDirInput.trim());
      }
    );
  });
};

export const loadEnvVariables = async (): Promise<void> => {
  const projectRoot = execSync('git rev-parse --show-toplevel', {
    encoding: 'utf-8',
  }).trim();
  let envPath = path.join(projectRoot, '.env.local'); // Default location

  if (!fs.existsSync(envPath)) {
    console.log(`.env.local not found at ${envPath}`);
    const envDirInput = await promptForEnvDir(projectRoot);
    envPath = envDirInput
      ? path.join(projectRoot, envDirInput, '.env.local')
      : '';
  }

  if (envPath && fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const [key, value] of Object.entries(envConfig)) {
      process.env[`TF_VAR_${key.toLowerCase()}`] = value;
    }
    console.log(`Environment variables set for Terraform from ${envPath}`);
  } else {
    console.log('Continuing without setting environment variables.');
  }
};
