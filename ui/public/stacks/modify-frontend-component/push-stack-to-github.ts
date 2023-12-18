// import { stackDB } from '@/app/stacks/stack-db';
import { Octokit } from '@octokit/rest';
import axios from 'axios';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = 'stackwiseai';
const repo = 'stackwise';
const vercelToken = process.env.VERCEL_TOKEN;
const teamId = process.env.TEAM_ID;
const repoId = process.env.REPO_ID;
const randomString = generateRandomString(10);
const sourceBranch = process.env.VERCEL_GIT_COMMIT_REF ?? ''; // or 'master', depending on your repository
export async function pushStackToGithub(
  fileContent: any,
  path,
  message,
  isBinary = false,
) {
  const branch = sourceBranch;

  const gitDiffUrl = await pushToBranch(
    fileContent,
    branch,
    path,
    message,
    isBinary,
  );
  console.log('gitDiffUrl', gitDiffUrl);
  // const vercelLink = await deployToVercel(branch);
  const vercelLink = '';
  const responseJson = { gitDiffUrl, vercelLink };
  return responseJson;
}

async function pushToBranch(newContent, branch, path, message, isBinary) {
  try {
    let parentSha;
    const { data: sourceBranchData } = await octokit.repos.getBranch({
      owner,
      repo,
      branch: sourceBranch,
    });
    parentSha = sourceBranchData.commit.sha;
    console.log('parentSha', parentSha);
    // Create a new branch
    console.log('Creating ref for :', branch);
    // await octokit.git.createRef({
    //   owner,
    //   repo,
    //   ref: `refs/heads/${branch}`,
    //   sha: parentSha,
    // });
    // console.log('Created ref for :', branch);

    // Get the SHA of the tree from the latest commit
    const { data: commitData } = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: parentSha,
    });
    const treeSha = commitData.tree.sha;

    // Create a new tree with the changes // Implement this function based on your needs

    let blobSha;

    // if (isBinary) {
    //   console.log("newContent", newContent);
    //   // Create a new blob for the binary content
    //   const { data: blobData } = await octokit.git.createBlob({
    //     owner,
    //     repo,
    //     content: newContent,
    //     encoding: "base64",
    //   });
    //   blobSha = blobData.sha;
    // }

    const { data: treeData } = await octokit.git.createTree({
      owner,
      repo,
      tree: [
        isBinary
          ? {
              path,
              mode: '100644', // blob (file)
              type: 'blob',
              sha: newContent,
            }
          : {
              path,
              mode: '100644', // blob (file)
              type: 'blob',
              content: newContent,
            },
      ],
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

    console.log('Created commit:', newCommitData.sha);

    // Update the branch reference to point to the new commit
    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommitData.sha,
    });
    // const jsonData = stackDB;
    // const stackDBFileContent = formatSortedJSON(jsonData);

    console.log('Successfully pushed to branch:', branch);
    const gitDiffLink = `https://github.com/${owner}/${repo}/compare/${sourceBranch}...${branch}`;
    console.log('gitDiffLink', gitDiffLink);
    return gitDiffLink;
  } catch (error) {
    console.error('Error pushing to branch:', error);
  }
}

function generateRandomString(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function deployToVercel(branch) {
  const apiEndpoint = 'https://api.vercel.com/v9/now/deployments';

  let config = {
    method: 'post',
    url: apiEndpoint + (teamId ? `?teamId=${teamId}` : ''),
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      'Content-Type': 'application/json',
    },
    data: {
      name: repo,
      gitSource: {
        type: 'github',
        ref: branch,
        repo: `${owner}/${repo}`,
        repoId: repoId,
      },
    },
  };

  try {
    const response = await axios(config);
    return `https://${response.data.alias[0]}`;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error Data:', error.response.data);
      console.error('Error Status:', error.response.status);
      console.error('Error Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error Message:', error.message);
    }
    console.error('Error Config:', error.config);
  }
}

function sortJSONKeys(data: Record<string, any>): Record<string, any> {
  return Object.keys(data)
    .sort()
    .reduce((obj: Record<string, any>, key: string) => {
      obj[key] = data[key];
      return obj;
    }, {});
}

function formatSortedJSON(data: Record<string, any>): string {
  const sortedData = sortJSONKeys(data);
  return `export const stackDB = ${JSON.stringify(sortedData, null, 2)};`;
}
