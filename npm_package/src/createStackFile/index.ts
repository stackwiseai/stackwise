import path from 'path';
import fs from 'fs';

export default function createStackFile(functionCode: string) {
  // find directory root here
  const stackPath = path.join(process.cwd(), 'app', 'actions.ts');

  // Create directory if it doesn't exist
  if (!fs.existsSync(stackPath)) {
    fs.mkdirSync(stackPath, { recursive: true });
    functionCode = `'use server'\n\n` + functionCode;
  } else {
    functionCode = `\n\n` + functionCode;
  }

  // Write the skeleton to the file
  fs.writeFileSync(stackPath, functionCode);
  console.log(`File created at ${stackPath}`);
}
