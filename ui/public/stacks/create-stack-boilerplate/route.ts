import { getSupabaseClient } from '@/app/stacks/stack-db';

import { pushStackToGithub } from '../modify-frontend-component/push-stack-to-github';

const owner = 'stackwiseai';
const repo = 'stackwise';
const sourceBranch = process.env.VERCEL_GIT_COMMIT_REF ?? ''; // or 'master', depending on your repository

export async function POST(req: Request) {
  const supabase = await getSupabaseClient();
  // add a field to data
  const data = await req.json();
  data.tags = ['draft'];
  const { data: insertedData, error } = await supabase
    .from('stack')
    .insert([data])
    .single();
  if (error) {
    throw error;
  }

  let path = `ui/app/components/stacks/${data.id}.tsx`;
  let message = `Frontend For Stack ${data.id} created`;
  let response = await getFileFromGithub(
    'ui/public/stacks/create-stack-boilerplate.tsx',
  );
  await pushStackToGithub(response.sha, path, message, true);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  path = `ui/api/${data.id}/route.ts`;
  message = `Backend For Stack ${data.id} created`;
  response = await getFileFromGithub(
    'ui/public/stacks/create-stack-boilerplate/route.ts',
  );
  // content = readFileSync(`app/api/boilerplate-basic/route.ts`, "utf8");
  await pushStackToGithub(response.sha, path, message, true);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  path = `ui/public/stack-pictures/${data.id}.png`;
  message = `Image For Stack ${data.id} created`;

  response = await getFileFromGithub(
    'ui/public/stack-pictures/boilerplate-basic.png',
  );
  await pushStackToGithub(response.sha, path, message, true);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await supabase.rpc('commit');
  // Return a success response
  return new Response(JSON.stringify({}), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function getFileFromGithub(path) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${sourceBranch}`;
  console.log(url, 'url');
  const response = await fetch(url, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });
  return response.json();
}
