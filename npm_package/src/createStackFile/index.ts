import path from 'path';
import fs from 'fs';

export default async function createStackFile(
  functionCode: string,
  parseFormData: string
) {
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
    const fullContents =
      "'use server'\n\n" + parseFormData + '\n\n' + functionCode;
    fs.writeFileSync(filePath, fullContents);
  } else {
    // If the file exists, replace content starting from 'parseFormData'
    let fileContent = fs.readFileSync(filePath, 'utf8');
    const parseFormDataIndex = fileContent.indexOf(
      'export const parseFormData'
    );

    const fullContents = '\n\n' + parseFormData + '\n\n' + functionCode;

    // If 'parseFormData' function exists, replace everything after it
    if (parseFormDataIndex !== -1) {
      fileContent = fileContent.substring(0, parseFormDataIndex);
      fileContent += fullContents;
      fs.writeFileSync(filePath, fileContent);
    } else {
      fs.appendFileSync(filePath, fullContents);
    }
  }

  console.log(`File updated at ${filePath}`);
}
