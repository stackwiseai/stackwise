import transformJSON from "./transformJSON";

describe("transformJSON", () => {
  test("transformJSON behaves correctly", () => {
    // Sample JSON-like string with placeholders
    const inputString = {
      input: { test: "ok@var" },
      outExample: { test: "ok" },
    };

    const result = transformJSON(inputString);

    const expectedOutput = {
      input: `{"test":ok}`,
      outExample: { test: "ok" },
    };

    // Check if the result matches the expected output
    expect(result).toEqual(expectedOutput);
  });
});
