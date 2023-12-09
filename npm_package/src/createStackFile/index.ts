import path from 'path';
import fs from 'fs';

export default async function createStackFile(functionCode: string) {
  // Find directory root here
  const filePath = path.join(process.cwd(), 'app', 'actions.ts');

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    // If the file does not exist, create the directory if needed
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Add 'use server' at the beginning and create a new file
    functionCode = "'use server'\n\n" + functionCode;
    fs.writeFileSync(filePath, functionCode);
  } else {
    // If the file exists, append the new content
    functionCode = '\n\n' + functionCode;
    fs.appendFileSync(filePath, functionCode);
  }

  console.log(`File updated at ${filePath}`);
}
