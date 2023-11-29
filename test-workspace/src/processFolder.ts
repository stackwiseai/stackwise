import * as path from 'path';
import { exec } from 'child_process';
import { findFunctionName } from './findFunctionName';
import { keyTapWithDelay } from './keyTapWithDelay';
import { saveFileContent } from './saveFileContent';
import { restoreFileContent } from './restoreFileContent';
import { concatenateFiles } from './concatenateFiles';
import { removeFile, stackRegistryPath, fixturesPath, stacksPath } from '.';
import { clearFolder } from './clearFolder';

/**
 * Processes each folder.
 * @param folder - The folder to process.
 */
export async function processFolder(folder: string): Promise<void> {
    removeFile(stackRegistryPath);

    if (folder === 'stacks') {
        return;
    }
    console.log('Processing folder: ' + folder);
    const tempTsFilePath: string = path.join(fixturesPath, folder, 'input.ts');
    const outputFilePath: string = path.join(fixturesPath, folder, 'output.ts');

    console.log('tempTsFilePath: ' + tempTsFilePath);
    console.log('outputFilePath: ' + outputFilePath);

    const originalContent: string | null = await saveFileContent(tempTsFilePath);
    console.log('Original content saved');

    const command: string = `code ${tempTsFilePath}`;
    exec(command);
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(1000);

    await keyTapWithDelay('up', 'command', 1000);
    await keyTapWithDelay('enter', null, 200);
    await keyTapWithDelay('s', 'command', 8000);
    await keyTapWithDelay('s', 'command', 200);
    console.log('Performed key taps with delays');

    const newContent: string | null = await saveFileContent(tempTsFilePath);
    console.log('New content read');
    const functionName: string | null = findFunctionName(newContent || '');
    console.log('Function name found:', functionName);

    const concatenatedContent: string = concatenateFiles(originalContent || '', newContent || '', functionName || '');
    console.log('Files concatenated');

    restoreFileContent(outputFilePath, concatenatedContent);
    console.log('Output file restored with concatenated content');

    restoreFileContent(tempTsFilePath, originalContent || '');
    console.log('Temp file restored to original content');
    clearFolder(stacksPath);
}
