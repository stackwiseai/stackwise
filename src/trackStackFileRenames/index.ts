import * as vscode from 'vscode';
import chokidar from 'chokidar';
import { directoryPath } from '../constants';
import path from 'path';
import stackRegistry from '../stack/registry';

export default function trackStackFileRenames(
  context: vscode.ExtensionContext
) {
  const eventBuffer = [];
  const bufferTime = 1000; // Buffer time in milliseconds

  // Initialize Chokidar watcher. This tracks file renames and deletions.
  const watcher = chokidar.watch(directoryPath, {
    ignored: /^\./,
    persistent: true,
  });

  // Function to process buffered events
  function processBufferedEvents() {
    const addedFiles = new Map();
    const unlinkedFiles = new Map();

    // Categorize events
    eventBuffer.forEach(({ event, filePath, timestamp }) => {
      const fileName = path.basename(filePath);
      if (event === 'add') {
        addedFiles.set(fileName, { filePath, timestamp });
      } else if (event === 'unlink') {
        unlinkedFiles.set(fileName, { filePath, timestamp });
      }
    });

    // Process rename and delete events
    unlinkedFiles.forEach((unlinkedFile, unlinkedFileName) => {
      let isRename = false;
      addedFiles.forEach((addedFile, addedFileName) => {
        // Check if an 'add' event closely follows an 'unlink' event
        if (
          Math.abs(addedFile.timestamp - unlinkedFile.timestamp) < bufferTime
        ) {
          const oldNameWithoutExt = unlinkedFileName.replace('.ts', '');
          const newNameWithoutExt = addedFileName.replace('.ts', '');

          // Handle file rename
          if (stackRegistry.nameExists(oldNameWithoutExt)) {
            stackRegistry.update(oldNameWithoutExt, newNameWithoutExt);
            console.log(
              `File renamed from ${oldNameWithoutExt} to ${newNameWithoutExt}`
            );
          }
          addedFiles.delete(addedFileName);
          isRename = true;
        }
      });

      // Handle file deletion
      if (!isRename) {
        const nameWithoutExt = unlinkedFileName.replace('.ts', '');
        if (stackRegistry.nameExists(nameWithoutExt)) {
          stackRegistry.remove(nameWithoutExt); // Assuming you have a remove method in stackRegistry
          console.log(`File deleted: ${nameWithoutExt}`);
        }
      }
    });

    eventBuffer.length = 0; // Clear the buffer after processing
  }

  // Event handler for watcher
  watcher.on('all', (event, filePath) => {
    console.log(`File ${filePath} has been ${event}ed`);
    eventBuffer.push({ event, filePath, timestamp: Date.now() });

    // Set a timeout to process events in the buffer
    setTimeout(processBufferedEvents, bufferTime);
  });

  context.subscriptions.push({
    dispose: () => {
      watcher.close();
    },
  });
}
