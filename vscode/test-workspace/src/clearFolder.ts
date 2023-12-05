import * as fs from 'fs';
import * as path from 'path';

/**
 * Clears a folder.
 * @param folderPath - The path of the folder to clear.
 */

export function clearFolder(folderPath: string): void {
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
