import * as fs from 'fs';

/**
 * Function to restore file content
 * @param filePath - The path of the file to restore.
 * @param content - The content to write into the file.
 */
export function restoreFileContent(filePath: string, content: string | null): void {
    if (content !== null) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}
