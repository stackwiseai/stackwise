const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const robot = require('robotjs');

// Define the test workspace and fixtures path
const currentWorkingDirectory = process.cwd();
const fixturesPath = path.join(currentWorkingDirectory, 'fixtures');
const stacksPath = path.join(currentWorkingDirectory, 'stacks');
const stackRegistryPath = path.join(currentWorkingDirectory, '../stackRegistry.json');

// Function to delay execution

/**
 * Finds the first occurrence of a pattern FUNCTION(STUFF) in a string and returns FUNCTION.
 * @param {string} str - The string to search in.
 * @returns {string|null} The function name if found, otherwise null.
 */
function findFunctionName(str) {
    // Adjusted regular expression to match patterns with spaces or newlines between FUNCTION and (STUFF)
    const pattern = /(\w+)\s*\(\s*(.*?)\s*\)/s;
    const match = str.match(pattern);

    // If a match is found, return the function name (first capture group)
    return match ? match[1] : null;
}

// Function to perform key tap with a delay
async function keyTapWithDelay(key, modifier, waitTime) {
    console.log('key: ' + key);
    console.log('modifier: ' + modifier);
    
    if (modifier) {
        robot.keyTap(key, modifier);
    } else {
        robot.keyTap(key);
    }
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


    await delay(waitTime);
}

function removeFile(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}

async function saveFileContent(filePath) {
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
    }
    return null;
}

// Function to restore file content
function restoreFileContent(filePath, content) {
    if (content !== null) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}    




/**
 * Concatenates the contents of three files.
 * @param {string} originalContent - Content of the first file (before modification).
 * @param {string} newContent - Content of the second file (after modification).
 * @param {string} variable - Name of the variable for the third file's path.
 * @param {string} fixturesPath - Base path for fixtures.
 * @returns {string} The concatenated content of the three files.
 */
function concatenateFiles(originalContent, newContent, variable) {
    const stackFilePath = path.join(currentWorkingDirectory, 'stacks', `${variable}.ts`);

    console.log('Third file path determined:', stackFilePath);

    // Read content of the third file
    const contentVariable = fs.existsSync(stackFilePath) ? fs.readFileSync(stackFilePath, 'utf8') : '';
    console.log('Read content of the third file');

    // Concatenate contents
    const concatenatedContent = originalContent + '\n' + newContent + '\n\n'+ contentVariable;
    console.log('Contents concatenated');

    return concatenatedContent;
}


// Process each folder
async function processFolder(folder) {
    removeFile(stackRegistryPath);

    if (folder === 'stacks') {
        return;
    }
    console.log('Processing folder: ' + folder);
    const tempTsFilePath = path.join(fixturesPath, folder, 'input.ts');
    const outputFilePath = path.join(fixturesPath, folder, 'output.ts');

    console.log('tempTsFilePath: ' + tempTsFilePath);
    console.log('outputFilePath: ' + outputFilePath);
    
    const originalContent = await saveFileContent(tempTsFilePath);
    console.log('Original content saved');

    // Open the file in VSCode
    const command = `code ${tempTsFilePath}`;
    exec(command);
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(1000);

    // Perform key taps with delays
    await keyTapWithDelay('up', 'command', 1000);
    await keyTapWithDelay('enter', null, 200);
    await keyTapWithDelay('s', 'command', 7000);
    await keyTapWithDelay('s', 'command', 200);
    console.log('Performed key taps with delays');

    const newContent = await saveFileContent(tempTsFilePath);
    console.log('New content read');
    console.log('newContent: ' + newContent);
    const functionName = findFunctionName(newContent);
    console.log('Function name found:', functionName);

    const concatenatedContent = concatenateFiles(originalContent, newContent, functionName);
    console.log('Files concatenated');

    restoreFileContent(outputFilePath, concatenatedContent); // modify output.ts
    console.log('Output file restored with concatenated content');

    restoreFileContent(tempTsFilePath, originalContent);
    console.log('Temp file restored to original content');
    clearFolder(stacksPath);
}




async function main() {
    await keyTapWithDelay('w', 'command', 800);
    await keyTapWithDelay('w', 'command', 800);
    await keyTapWithDelay('w', 'command', 800);
    await keyTapWithDelay('w', 'command', 800);
    await keyTapWithDelay('w', 'command', 800);
    await keyTapWithDelay('w', 'command', 800);
    await keyTapWithDelay('w', 'command', 800);

    clearFolder(stacksPath);
    removeFile(stackRegistryPath);

    const testFolders = fs.readdirSync(fixturesPath).filter(folder => 
        fs.statSync(path.join(fixturesPath, folder)).isDirectory());

    for (const folder of testFolders) {
        await processFolder(folder);
    }
    clearFolder(stacksPath);
}

function clearFolder(folderPath) {
    if (fs.existsSync(folderPath)) {
        // Read all files and subdirectories
        fs.readdirSync(folderPath).forEach(file => {
            const curPath = path.join(folderPath, file);

            // Delete file or recursively delete directory
            if (fs.lstatSync(curPath).isDirectory()) {
                clearFolder(curPath); // Recursive call
            } else {
                fs.unlinkSync(curPath); // Delete file
            }
        });
    } else {
        fs.mkdirSync(folderPath, { recursive: true }); // Create the folder if it doesn't exist
    }
}

main().catch(console.error);


