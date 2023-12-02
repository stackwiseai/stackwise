import uploadFileToCollection from "../../stacks/uploadFileToCollection";
test("Upload a new file on Pocketbase to a collection", async () => {
  // ===========================================================================
  // Inputs
  // ===========================================================================

  /**
   * This is the collection in Pocketbase where images are stored.
   */
  const collectionName = "media";

  /**
   * Function for mocking a File/Blob.
   * Normally this would be your image, pdf, etc. For simplicity of the test,
   * we will mock a `.txt` file with some text content.
   */
  function createFileFromString(
    content: string,
    fileName: string,
    mimeType: string
  ) {
    const blob = new Blob([content], { type: mimeType });

    return new File([blob], fileName, { type: mimeType });
  }

  /** Data in the "file" column. */
  const testFile = createFileFromString(
    "This is the content of the file.",
    "example.txt",
    "text/plain"
  );

  /** Data in the "title" column. */
  const title = "Awesome File";

  // ===========================================================================
  // Execution
  // ===========================================================================

  // Now you can use your upload function
  const createdRecord = await await uploadFileToCollection(
    collectionName,
    testFile,
    title
  );

  expect(createdRecord).toHaveProperty("file");
});
