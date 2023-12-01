import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { directoryPath } from '../../constants';

export default function createStackFile(
  skeleton: string,
  methodName: string,
  integration: string
) {
  console.log('createStackFile called', integration);
  console.log('directoryPath:', directoryPath);
  let stackPath = directoryPath;
  if (integration !== 'generic') {
    stackPath = path.join(directoryPath, integration);
  }
  // Create directory if it doesn't exist
  if (!fs.existsSync(stackPath)) {
    fs.mkdirSync(stackPath, { recursive: true });
  }

  console.log('stackPath:', stackPath);
  const baseFilePath = path.join(stackPath, `${methodName}`);

  // Check for existing file and append a number if necessary
  let fileIndex = 1;
  let filePath = baseFilePath + '.ts';
  while (fs.existsSync(filePath)) {
    filePath = `${baseFilePath}_${fileIndex}.ts`;
    fileIndex++;
  }

  // Check if Next.js version is 13 or higher and modify skeleton if necessary
  if (getNextJsVersion()) {
    console.log('Next.js version is 13 or higher');
    skeleton = `'use server'\n\n` + skeleton;
  } else {
    console.log('Next.js version is less than 13 or not nextjs');
  }

  // Write the skeleton to the file
  fs.writeFileSync(filePath, skeleton);
  console.log(`File created at ${filePath}`);
}

function getNextJsVersion() {
  // Assuming there's an open workspace, get its root path
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    console.error('No workspace folder found');
    return false;
  }

  const workspaceRoot = workspaceFolders[0].uri.fsPath;
  const packageJsonPath = path.join(workspaceRoot, 'package.json');
  console.log('Workspace Root:', workspaceRoot);
  console.log('package.json path:', packageJsonPath);

  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJsonData = fs.readFileSync(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageJsonData);
      const nextVersion =
        (packageJson.dependencies && packageJson.dependencies.next) ||
        (packageJson.devDependencies && packageJson.devDependencies.next);

      if (nextVersion) {
        const versionParts = nextVersion
          .replace('^', '')
          .replace('~', '')
          .split('.');
        const majorVersion = parseInt(versionParts[0]);
        const minorVersion = parseInt(versionParts[1]);

        if (majorVersion === 13 && minorVersion >= 4) {
          return true; // Next.js 13.4 or higher
        } else if (majorVersion === 13) {
          // Check next.config.js for experimental.serverActions flag
          return checkNextConfigForExperimentalFlag(workspaceRoot);
        } else {
          return false; // Next.js version is less than 13
        }
      }
    } catch (error) {
      console.error('Error reading package.json:', error.message);
    }
  } else {
    console.log('package.json not found at the expected location');
  }
  return false;
}

function checkNextConfigForExperimentalFlag(workspaceRoot) {
  const nextConfigPath = path.join(workspaceRoot, 'next.config.js');
  console.log('next.config.js path:', nextConfigPath);
  if (fs.existsSync(nextConfigPath)) {
    try {
      const nextConfigData = fs.readFileSync(nextConfigPath, 'utf8');
      const experimentalServerActionsRegex =
        /experimental\s*:\s*\{[^}]*serverActions\s*:\s*true[^}]*\}/;
      console.log('next.config.js data:', nextConfigData);
      return experimentalServerActionsRegex.test(nextConfigData);
    } catch (error) {
      console.error('Error reading next.config.js:', error.message);
    }
  } else {
    console.log('next.config.js not found at the expected location');
  }
  return false;
}
