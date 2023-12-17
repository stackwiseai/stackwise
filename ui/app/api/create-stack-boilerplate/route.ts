import { Octokit } from "@octokit/rest";

import createStack from "./create-stack";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const vercelToken = process.env.VERCEL_TOKEN;
const teamId = process.env.TEAM_ID;
const repoId = process.env.REPO_ID;

const owner = "stackwiseai";
const repo = "stackwise";
const sourceBranch = process.env.VERCEL_GIT_COMMIT_REF ?? ""; // or 'master', depending on your repository
export const fetchCache = "force-no-store"; // TODO: remove this line to enable caching but without making the app completely static
export const revalidate = 0;
export async function POST(req: Request) {
  const data = await req.json();
  createStack(data);
  // Return a success response
  return new Response(JSON.stringify({}), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
