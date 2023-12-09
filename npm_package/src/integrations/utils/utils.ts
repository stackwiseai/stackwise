import fs from 'fs';
import fsExtra from 'fs-extra';
const fsPromise = require('fs').promises;
import path from 'path';
import { BoilerplateMetadata } from './types';

export const readFunctionToString = async (filePath: string) => {
  try {
    const absolutePath = path.resolve(filePath);
    const fileContents = fs.readFileSync(absolutePath, 'utf8');
    return fileContents;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
};

export async function writeStringToFile(content: string, filePath: string) {
  const absolutePath = path.resolve(filePath);

  try {
    await fsExtra.ensureDir(path.dirname(absolutePath));

    fs.writeFile(absolutePath, content, (err) => {});

    console.log(`Content written to ${absolutePath}`);
    return absolutePath;
  } catch (error) {
    console.error(`Error writing to ${absolutePath}:`, error);
  }
}

export async function readExplainFiles(dir: string): Promise<string> {
  let accumulatedContent = '';

  const entries = await fsPromise.readdir(dir, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const entryPath = path.join(dir, entry.name);
      const subEntries = await fsPromise.readdir(entryPath, {
        withFileTypes: true,
      });

      for (const subEntry of subEntries) {
        if (subEntry.isFile() && subEntry.name === 'explain.txt') {
          const content = await fsPromise.readFile(
            path.join(entryPath, 'explain.txt'),
            'utf-8'
          );
          accumulatedContent += '\n' + `'${entry.name}'` + ': ' + content;
        }
      }
    }
  }

  return accumulatedContent;
}

export function processBoilerplate(
  exampleBoilerplate: BoilerplateMetadata | BoilerplateMetadata[]
): string {
  let boilerplateContent;

  // It's either a string or an array of boilerplate metadata
  if (typeof exampleBoilerplate === 'string') {
    boilerplateContent = exampleBoilerplate;
  } else if (Array.isArray(exampleBoilerplate)) {
    // Use map to transform each BoilerplateMetadata into a string, then join them
    boilerplateContent = exampleBoilerplate
      .map((metadata) => metadata.functionString)
      .join('\n');
  }

  return boilerplateContent;
}
