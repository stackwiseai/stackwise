'use server';

import stack from 'stackwise';

export const callStack = async (formData: FormData) => {
  const data = formData.get('stack');
  console.log('data', data);
  return '';
};
