import * as fs from 'fs';

export async function saveFileContent(filePath: string): Promise<string | null> {
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
    }
    return null;
}
