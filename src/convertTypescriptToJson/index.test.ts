import convertTypescriptToJson from '.';

test('flattenInputJson correctly', () => {
  const jsonInput = `(property) input: {
    test: {
        example: boolean;
    };
}`;
  const expectedOutput = {
    test: {
        example: 'boolean'
    }
};

  const result = convertTypescriptToJson(jsonInput);
  expect(result).toEqual(expectedOutput);
});

test('flattenInputJson correctly', () => {
  const jsonInput = `
\`\`\`typescript
(property) 'input': string[]
\`\`\`


`;
  const expectedOutput = {
    input: 'string[]'
  };

  const result = convertTypescriptToJson(jsonInput);
  expect(result).toEqual(expectedOutput);
});

test('flattenInputJson correctly', () => {
  const jsonInput = `
\`\`\`(property) input: string
\`\`\`
  
`;
  const expectedOutput = {
    input: 'string'
  };

  const result = convertTypescriptToJson(jsonInput);
  expect(result).toEqual(expectedOutput);
});





