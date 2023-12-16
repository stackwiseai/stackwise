#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { vol } from 'memfs';
import archiver from 'archiver';
import transformRoute from './transformRoute.js';

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

  // Use an in-memory file system for the transformed file
  vol.writeFileSync('/lambda.js', transformedContent);

  // Create a zip archive in memory and write it to the 'lambda' subdirectory
  let buffer: Buffer = Buffer.from([]);
  const archive = archiver('zip', { zlib: { level: 9 } }).on(
    'data',
    data => (buffer = Buffer.concat([buffer, data as Buffer]))
  );

  archive.append(vol.createReadStream('/lambda.js'), { name: 'lambda.js' });
  await archive.finalize();

  const zipFilePath = path.join(lambdaDir, 'function.zip');
  fs.writeFileSync(zipFilePath, buffer);

  // Execute Terraform commands within the 'lambda' subdirectory
  execSync('terraform init', { cwd: lambdaDir, stdio: 'inherit' });
  execSync('terraform apply -auto-approve', {
    cwd: lambdaDir,
    stdio: 'inherit',
  });
}

const routePath = path.resolve(process.argv[2]); // Resolve the full path
packageAndDeployLambda(routePath).catch(console.error);
