import { Octokit } from '@octokit/rest';

import createStack from './create-stack';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const vercelToken = process.env.VERCEL_TOKEN;
const teamId = process.env.TEAM_ID;
const repoId = process.env.REPO_ID;

const owner = 'stackwiseai';
const repo = 'stackwise';
const sourceBranch = process.env.VERCEL_GIT_COMMIT_REF ?? ''; // or 'master', depending on your repository
export const fetchCache = 'force-no-store'; // TODO: remove this line to enable caching but without making the app completely static
export const revalidate = 0;
export async function POST(req: Request) {
  const data = await req.json();
  // get the token from header and strip the Bearer
  try {
    if (req.headers) {
      const header = req.headers.get('Authorization');
      if (header) {
        const token = header.split(' ')[1];
        const prLink = await createStack(data, token);
        return new Response(JSON.stringify({prLink}), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
    } else {
      throw new Error('No token provided');

    }} else {
      throw new Error('No headers provided');
    }
  } catch (error) {
    console.error('Error during data insertion:', error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } 
} 
