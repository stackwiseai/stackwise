import { getSupabaseClient } from "@/app/stacks/stack-db";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const vercelToken = process.env.VERCEL_TOKEN;
const teamId = process.env.TEAM_ID;
const repoId = process.env.REPO_ID;

const owner = "stackwiseai";
const repo = "stackwise";
const sourceBranch = process.env.VERCEL_GIT_COMMIT_REF ?? ""; // or 'master', depending on your repository

export async function POST(req: Request) {
  const authorizationHeaders = req.headers.get("Authorization");

  if (!authorizationHeaders) {
    throw new Error("No token provided");
  }
  const authorizationHeadersSplit = authorizationHeaders.split(" ");
  if (!authorizationHeadersSplit) {
    throw new Error("Invalid token provided");
  }

  const token = authorizationHeadersSplit[1];
  console.log(token, "token");
  const supabase = await getSupabaseClient(token);
  // add a field to data
  const data = await req.json();
  data.tags = ["draft"];
  const { data: insertedData, error } = await supabase
    .from("stack")
    .insert([data])
    .single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  // let filesArray = [];

  let path = `ui/app/components/stacks/${data.id}.tsx`;
  let message = `Frontend For Stack ${data.id} created`;
  let response = await getFileFromGithub(
    "ui/public/stacks/boilerplate-basic.tsx",
  );

  let filesArray = [
    {
      path: path,
      sha: response.sha,
    },
  ];

  await new Promise((resolve) => setTimeout(resolve, 1000));
  path = `ui/app/api/${data.id}/route.ts`;
  message = `Backend For Stack ${data.id} created`;
  response = await getFileFromGithub(
    "ui/public/stacks/boilerplate-basic/route.ts",
  );

  filesArray.push({
    path: path,
    sha: response.sha,
  });

  path = `ui/public/stack-pictures/${data.id}.png`;
  message = `Image For Stack ${data.id} created`;

  response = await getFileFromGithub(
    "ui/public/stack-pictures/boilerplate-basic.png",
  );

  filesArray.push({
    path: path,
    sha: response.sha,
  });

  await pushMultipleFilesToBranch(filesArray, sourceBranch, message);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  await supabase.rpc("commit");
  // Return a success response
  return new Response(JSON.stringify({}), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function getFileFromGithub(path) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${sourceBranch}`;
  console.log(url, "url");
  const response = await fetch(url, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });
  return response.json();
}

async function pushMultipleFilesToBranch(filesArray, branch, message) {
  try {
    let parentSha;
    const { data: sourceBranchData } = await octokit.repos.getBranch({
      owner,
      repo,
      branch: sourceBranch,
    });
    parentSha = sourceBranchData.commit.sha;

    const { data: commitData } = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: parentSha,
    });
    const treeSha = commitData.tree.sha;
    //iterate througjh filesArray

    let tree = filesArray.map((file) => ({
      path: file.path,
      mode: "100644", // blob (file)
      type: "blob",
      sha: file.sha,
    }));

    const { data: treeData } = await octokit.git.createTree({
      owner,
      repo,
      tree,
      base_tree: treeSha,
    });

    // Create a new commit with the new tree and the parent commit
    const { data: newCommitData } = await octokit.git.createCommit({
      owner,
      repo,
      message,
      tree: treeData.sha,
      parents: [parentSha],
    });

    console.log("Created commit:", newCommitData.sha);

    // Update the branch reference to point to the new commit
    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommitData.sha,
    });

    console.log("Successfully pushed multiple files to branch:", branch);
    const gitDiffLink = `https://github.com/${owner}/${repo}/compare/${sourceBranch}...${branch}`;
    console.log("gitDiffLink", gitDiffLink);
    return gitDiffLink;
  } catch (error) {
    console.error("Error pushing multiple files to branch:", error);
  }
}
