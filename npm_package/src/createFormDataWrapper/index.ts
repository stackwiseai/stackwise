export default function createFormDataWrapper(
  input: Record<string, any>,
  methodName: string
): string {
  // Handle the case where there is no input
  if (!input || typeof input !== 'object' || Object.keys(input).length === 0) {
    return `export const parseFormData = async (prevState: any, formData: FormData) => {
  return await ${methodName}();
};`;
  }

  // Generate lines for extracting values from FormData
  const formDataLines = Object.entries(input)
    .map(([key, type]) => {
      if (type === 'number') {
        return `const ${key} = Number(formData.get('${key}'));`;
      } else if (type === 'boolean') {
        return `const ${key} = formData.get('${key}') === 'true';`;
      } else {
        // else you should get the 'video, audio, image' and strings as default
        return `const ${key} = formData.get('${key}');`;
      }
    })
    .join('\n  ');

  // Generate the function call with arguments
  const args = Object.keys(input).join(', ');

  return `export const parseFormData = async (prevState: any, formData: FormData) => {
  ${formDataLines}

  return await ${methodName}(${args});
};`;
}
