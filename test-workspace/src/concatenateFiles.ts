import * as fs from 'fs';
import * as path from 'path';
import { currentWorkingDirectory } from '.';

/**
 * Concatenates the contents of three files.
 * @param originalContent - Content of the first file (before modification).
 * @param newContent - Content of the second file (after modification).
 * @param variable - Name of the variable for the third file's path.
 * @returns The concatenated content of the three files.
 */
export function concatenateFiles(originalContent: string, newContent: string, variable: string): string {
    const stackFilePath: string = path.join(currentWorkingDirectory, 'stacks', `${variable}.ts`);

    console.log('Third file path determined:', stackFilePath);

    const contentVariable: string = fs.existsSync(stackFilePath) ? fs.readFileSync(stackFilePath, 'utf8') : '';
    console.log('Read content of the third file');

    const concatenatedContent: string = originalContent + '\n' + newContent + '\n\n' + contentVariable;
    console.log('Contents concatenated');

    return concatenatedContent;
}
