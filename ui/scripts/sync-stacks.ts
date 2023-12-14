import * as fs from 'fs-extra';
import path from 'path';

async function removeDirectory(dirPath: string): Promise<void> {
  try {
    await fs.remove(dirPath);
    console.log(`Removed directory: ${dirPath}`);
  } catch (err) {
    console.error(`Error removing directory ${dirPath}:`, err);
  }
}

async function copyRecursively(src: string, dest: string): Promise<void> {
  // Create destination folder if it doesn't exist
  await fs.ensureDir(dest);

  // Read the source directory
  const items = await fs.readdir(src);

  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    const stats = await fs.stat(srcPath);

    if (stats.isDirectory()) {
      // If it's a directory, call recursively
      await copyRecursively(srcPath, destPath);
    } else {
      // If it's a file, check if it exists in destination
      if (!(await fs.pathExists(destPath))) {
        // Copy file if it doesn't exist in destination
        await fs.copy(srcPath, destPath);
      }
    }
  }
}

async function main() {
  let destinationFolder = '../public/stacks';

  try {
    await removeDirectory(destinationFolder);
    console.log(`Folder ${destinationFolder} deleted`);

    // Usage example
    let sourceFolder = '../app/components/stacks';
    await copyRecursively(sourceFolder, destinationFolder);
    console.log('Copy completed.');

    sourceFolder = '../app/api';
    await copyRecursively(sourceFolder, destinationFolder);
    console.log('Copy completed.');
  } catch (err) {
    console.error('Error during operation:', err);
  }
}

main();
