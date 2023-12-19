#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import transformRoute from './transformRoute.js';
import { loadEnvVariables } from './handleEnv.js';
import { getLambdaFunctionArn } from './getLambdaFunctionArn.js';
import terraformLambdaTemplate from './terraformLambdaTemplate.js';

// Define __dirname in ES module
const __dirname = new URL('.', import.meta.url).pathname;

async function packageAndDeployLambda(routePath: string): Promise<void> {
  const functionName = 'test_function';
  const region = 'us-east-1';
  const roleName = 'lambda_role';

  // Determine the base directory of route.ts and create 'lambda' subdirectory
  const lambdaDir = path.join(routePath, 'lambda');
  if (fs.existsSync(lambdaDir)) {
    fs.rmSync(lambdaDir, { recursive: true });
  }
  fs.mkdirSync(lambdaDir);

  const routeDir = path.join(routePath, 'route.ts');

  // Read and transform the original file
  const originalContent = fs.readFileSync(routeDir, 'utf8');
  const transformedContent = await transformRoute(originalContent);

  // Initialize npm and install packages
  execSync('npm init -y', { cwd: lambdaDir, stdio: 'inherit' });
  const packageJsonPath = path.join(lambdaDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.type = 'module'; // Set package.json to use ES module
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  const packages = ['openai']; // Add other packages as needed
  if (packages.length > 0) {
    execSync(`npm install ${packages.join(' ')}`, {
      cwd: lambdaDir,
      stdio: 'inherit',
    });
  }

  // Write the transformed file to the lambda directory
  fs.writeFileSync(path.join(lambdaDir, 'index.js'), transformedContent);

  // Create the utils
  const iamShFilePath = path.join(__dirname, 'utils', 'check_iam_role.sh');
  const checkIAmOutput = execSync(
    `bash ${iamShFilePath} "${roleName}" "${region}"`,
    {
      encoding: 'utf-8',
    }
  );
  const iamExists = JSON.parse(checkIAmOutput).role_exists === 'false' ? 1 : 0;

  // Setting the correct lambda function name
  let terraformConfig = terraformLambdaTemplate(
    region,
    functionName,
    roleName,
    iamExists
  );
  fs.writeFileSync(path.join(lambdaDir, 'lambda.tf'), terraformConfig);

  // Create the zip file
  const zipFilePath = path.join(lambdaDir, 'function.zip');
  execSync(`zip -r ${zipFilePath} .`, { cwd: lambdaDir, stdio: 'inherit' });

  // Find the project root directory
  await loadEnvVariables();

  execSync(`terraform init`, {
    cwd: lambdaDir,
    stdio: 'inherit',
  });
  // Check if the lambda function already exists, if it does import it
  const lambdaShFilePath = path.join(
    __dirname,
    'utils',
    'terraform_import_lambda.sh'
  );
  execSync(`bash ${lambdaShFilePath} "${functionName}" "${region}"`, {
    encoding: 'utf-8',
    cwd: lambdaDir,
    stdio: 'inherit',
  });
  execSync(`terraform apply -auto-approve`, {
    cwd: lambdaDir,
    stdio: 'inherit',
  });
}

const routePath = path.resolve(process.argv[2]); // Resolve the full path
packageAndDeployLambda(routePath).catch(console.error);
