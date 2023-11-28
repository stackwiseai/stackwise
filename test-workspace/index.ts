import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import * as robot from 'robotjs';

// Define the test workspace and fixtures path
const currentWorkingDirectory: string = process.cwd();
const fixturesPath: string = path.join(currentWorkingDirectory, 'fixtures');
const stacksPath: string = path.join(currentWorkingDirectory, 'stacks');
const stackRegistryPath: string = path.join(currentWorkingDirectory, '../stackRegistry.json');

/**
 * Finds the first occurrence of a pattern FUNCTION(STUFF) in a string and returns FUNCTION.
 * @param str - The string to search in.
 * @returns The function name if found, otherwise null.
 */
function findFunctionName(str: string): string | null {
    const pattern: RegExp = /(\w+)\s*\(\s*(.*?)\s*\)/s;
    const match: RegExpExecArray | null = pattern.exec(str);

    return match ? match[1] : null;
}


/**
 * Function to perform key tap with a delay
 * @param key - The key to tap.
 * @param modifier - The modifier key.
 * @param waitTime - Time to wait after key tap.
 */
async function keyTapWithDelay(key: string, modifier: string | null, waitTime: number): Promise<void> {
    console.log('key: ' + key);
    console.log('modifier: ' + modifier);
    
    if (modifier) {
        robot.keyTap(key, modifier);
    } else {
        robot.keyTap(key);
    }

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(waitTime);
}

function removeFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}

async function saveFileContent(filePath: string): Promise<string | null> {
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
    }
    return null;
}

/**
 * Function to restore file content
 * @param filePath - The path of the file to restore.
 * @param content - The content to write into the file.
 */
function restoreFileContent(filePath: string, content: string | null): void {
    if (content !== null) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

/**
 * Concatenates the contents of three files.
 * @param originalContent - Content of the first file (before modification).
 * @param newContent - Content of the second file (after modification).
 * @param variable - Name of the variable for the third file's path.
 * @returns The concatenated content of the three files.
 */
function concatenateFiles(originalContent: string, newContent: string, variable: string): string {
    const stackFilePath: string = path.join(currentWorkingDirectory, 'stacks', `${variable}.ts`);

    console.log('Third file path determined:', stackFilePath);

    const contentVariable: string = fs.existsSync(stackFilePath) ? fs.readFileSync(stackFilePath, 'utf8') : '';
    console.log('Read content of the third file');

    const concatenatedContent: string = originalContent + '\n' + newContent + '\n\n' + contentVariable;
    console.log('Contents concatenated');

    return concatenatedContent;
}

/**
 * Processes each folder.
 * @param folder - The folder to process.
 */
async function processFolder(folder: string): Promise<void> {
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
    await keyTapWithDelay('s', 'command', 7000);
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

/**
 * Main function to run the process.
 */
async function main(): Promise<void> {
    await keyTapWithDelay('w', 'command', 800);
    await keyTapWithDelay('w', 'command', 800);
    await keyTapWithDelay('w', 'command', 800);
    await keyTapWithDelay('w', 'command', 800);
    await keyTapWithDelay('w', 'command', 800);
    await keyTapWithDelay('w', 'command', 800);
    await keyTapWithDelay('w', 'command', 800);
    

    clearFolder(stacksPath);
    removeFile(stackRegistryPath);

    const testFolders: string[] = fs.readdirSync(fixturesPath).filter(folder => 
        fs.statSync(path.join(fixturesPath, folder)).isDirectory());

    for (const folder of testFolders) {
        await processFolder(folder);
    }
    clearFolder(stacksPath);
}

/**
 * Clears a folder.
 * @param folderPath - The path of the folder to clear.
 */
function clearFolder(folderPath: string): void {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach(file => {
            const curPath: string = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                clearFolder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
    } else {
        fs.mkdirSync(folderPath, { recursive: true });
    }
}

main().catch(console.error);
