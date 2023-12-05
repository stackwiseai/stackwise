import useOpenAIstreamEndpoint from ".";

test("useOpenAIstreamEndpoint - should return a string", async () => {
  let asyncIterator;
  try {
    // Set up a test input
    const testInput = "What is the meaning of life?";

    // Call the function
    const resultGenerator = await useOpenAIstreamEndpoint(testInput);

    // Convert AsyncIterable to AsyncIterator
    asyncIterator = resultGenerator[Symbol.asyncIterator]();

    // Test the first result
    const firstResult = await asyncIterator.next();
    expect(typeof firstResult.value).toBe("string");
    expect(firstResult.value).toBe("");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    // close the stream
    await asyncIterator?.return?.();
  }
});
