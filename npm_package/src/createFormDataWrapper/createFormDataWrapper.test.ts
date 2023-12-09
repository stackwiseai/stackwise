import createFormDataWrapper from '.';

test('numbers', () => {
  const jsonInput = { num1: 'number', num2: 'number' };
  const methodName = 'multiplyNumbers';
  const expectedOutput = `export const parseFormData = async (prevState: any, formData: FormData) => {
  const num1 = Number(formData.get('num1'));
  const num2 = Number(formData.get('num2'));

  return await multiplyNumbers(num1, num2);
};`;

  const result = createFormDataWrapper(jsonInput, methodName);
  expect(result).toEqual(expectedOutput);
});

test('booleans', () => {
  const jsonInput = { test: 'boolean', ok: 'boolean' };
  const methodName = 'testResult';
  const expectedOutput = `export const parseFormData = async (prevState: any, formData: FormData) => {
  const test = formData.get('test') === 'true';
  const ok = formData.get('ok') === 'true';

  return await testResult(test, ok);
};`;

  const result = createFormDataWrapper(jsonInput, methodName);
  expect(result).toEqual(expectedOutput);
});

test('no input', () => {
  const jsonInput = null;
  const methodName = 'logTimeToDb';
  const expectedOutput = `export const parseFormData = async (prevState: any, formData: FormData) => {
  return await logTimeToDb();
};`;

  const result = createFormDataWrapper(jsonInput, methodName);
  expect(result).toEqual(expectedOutput);
});

test('image', () => {
  const jsonInput = { image: 'image' };
  const methodName = 'convertImage';
  const expectedOutput = `export const parseFormData = async (prevState: any, formData: FormData) => {
  const image = formData.get('image');

  return await convertImage(image);
};`;

  const result = createFormDataWrapper(jsonInput, methodName);
  expect(result).toEqual(expectedOutput);
});

test('video', () => {
  const jsonInput = { video: 'video' };
  const methodName = 'transVideo';
  const expectedOutput = `export const parseFormData = async (prevState: any, formData: FormData) => {
  const video = formData.get('video');

  return await transVideo(video);
};`;

  const result = createFormDataWrapper(jsonInput, methodName);
  expect(result).toEqual(expectedOutput);
});
