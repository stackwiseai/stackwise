import { getSupabaseClient } from '@/app/components/stacks/utils/stack-db';

import getFileFromGithub from './get-file-from-github';
import pushMultipleFilesToBranch from './push-multiple-files-to-branch';

export default async function createStack(data, token) {
  const stackId = data.name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();

  const supabase = await getSupabaseClient();
  const stackInfo = {
    name: data.name,
    id: stackId,
    description: data.description,
    tags: ['draft'],
  };
  const { data: insertedData, error } = await supabase
    .from('stack')
    .insert([stackInfo])
    .single();
  if (error) {
    if (error.message.includes('duplicate key ')) {
      throw new Error('This app already exists.');
    }
    throw error;
  }

  // creating api key
  let path = `ui/app/components/stacks/${stackInfo.id}.tsx`;
  let message = `Frontend For ${stackInfo.id} created`;
  let response = await getFileFromGithub(
    'ui/public/stacks/boilerplate-basic.tsx',
    token,
  );
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filesArray = [
    {
      path: path,
      sha: response.content,
      message: message,
    },
  ];

  path = `ui/app/api/stacks/${stackInfo.id}/route.ts`;
  message = `Backend For ${stackInfo.id} created`;
  response = await getFileFromGithub(
    'ui/public/stacks/boilerplate-basic/route.ts',
    token,
  );
  await new Promise((resolve) => setTimeout(resolve, 500));

  filesArray.push({
    path: path,
    sha: response.content,
    message: message,
  });

  path = `ui/public/stack-pictures/${stackInfo.id}.png`;
  message = `Preview For ${stackInfo.id} created`;

  response = await getFileFromGithub(
    'ui/public/stack-pictures/boilerplate-basic.png',
    token,
  );
  await new Promise((resolve) => setTimeout(resolve, 500));

  filesArray.push({
    path: path,
    sha: response.content,
    message: message,
  });
  // const sourceBranch = process.env.VERCEL_GIT_COMMIT_REF ?? ''; // or 'master', depending on your repository

  const prLink = await pushMultipleFilesToBranch(
    filesArray,
    stackInfo.id,
    token,
  );
  return prLink;
}
