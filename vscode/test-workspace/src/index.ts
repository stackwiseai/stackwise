import * as fs from 'fs';
import * as path from 'path';
import { keyTapWithDelay } from './keyTapWithDelay';
import { processFolder } from './processFolder';
import { clearFolder } from './clearFolder';

// Define the test workspace and fixtures path
export const currentWorkingDirectory: string = process.cwd();
export const fixturesPath: string = path.join(currentWorkingDirectory, 'fixtures');
export const stacksPath: string = path.join(currentWorkingDirectory, 'stacks');
export const stackRegistryPath: string = path.join(currentWorkingDirectory, '../stackRegistry.json');

export function removeFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
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

main().catch(console.error);
