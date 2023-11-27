import path from 'path';
import * as fs from 'fs';

export default function ensureDirectoryExistence(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        // Using `recursive: true` to create all necessary parent directories
        fs.mkdirSync(dir, { recursive: true });
        createGitIgnore(dir);
    }
  }
  
  // Create a .gitignore file if it does not exist
  function createGitIgnore(dir) {
    const gitIgnorePath = path.join(dir, '.gitignore');
    if (!fs.existsSync(gitIgnorePath)) {
        fs.writeFileSync(gitIgnorePath, 'llmCache.json\n');
    }

    const llmCachePath = path.join(dir, 'llmCache.json');
    if (!fs.existsSync(llmCachePath)) {
        fs.writeFileSync(llmCachePath, '{}\n');
    }
  }