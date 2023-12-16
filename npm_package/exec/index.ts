#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import transformRoute from './transformRoute.js';

// Define __dirname in ES module
const __dirname = new URL('.', import.meta.url).pathname;

async function packageAndDeployLambda(routePath: string): Promise<void> {
  // Determine the base directory of route.ts and create 'lambda' subdirectory
  const lambdaDir = path.join(routePath, 'lambda');
  if (!fs.existsSync(lambdaDir)) {
    fs.mkdirSync(lambdaDir);
  }

  const routeDir = path.join(routePath, 'route.ts');

  // Read and transform the original file
  const originalContent = fs.readFileSync(routeDir, 'utf8');
  const transformedContent = await transformRoute(originalContent);

  // Initialize npm and install packages
  execSync('npm init -y', { cwd: lambdaDir, stdio: 'inherit' });
  const packages = ['openai']; // Add other packages as needed
  if (packages.length > 0) {
    execSync(`npm install ${packages.join(' ')}`, {
      cwd: lambdaDir,
      stdio: 'inherit',
    });
  }

  // Write the transformed file to the lambda directory
  fs.writeFileSync(path.join(lambdaDir, 'index.js'), transformedContent);

  // Copy the lambda.tf file to the lambda directory
  const terraformFilePath = path.join(__dirname, 'lambda.tf');
  fs.copyFileSync(terraformFilePath, path.join(lambdaDir, 'lambda.tf'));

  // Create the utils
  const utilsFilePath = path.join(__dirname, 'utils', 'check_iam_role.sh');
  const utilsDir = path.join(lambdaDir, 'utils');
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir);
  }
  fs.copyFileSync(utilsFilePath, path.join(utilsDir, 'check_iam_role.sh'));

  // Create the zip file
  const zipFilePath = path.join(lambdaDir, 'function.zip');
  execSync(`zip -r ${zipFilePath} .`, { cwd: lambdaDir, stdio: 'inherit' });

  // Execute Terraform commands within the 'lambda' subdirectory
  execSync('terraform init', { cwd: lambdaDir, stdio: 'inherit' });
  execSync('terraform apply -auto-approve', {
    cwd: lambdaDir,
    stdio: 'inherit',
  });
}

const routePath = path.resolve(process.argv[2]); // Resolve the full path
packageAndDeployLambda(routePath).catch(console.error);
