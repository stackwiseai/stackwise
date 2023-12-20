import { Octokit } from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = 'stackwiseai';
const repo = 'stackwise';
const sourceBranch = process.env.VERCEL_GIT_COMMIT_REF ?? ''; // or 'master', depending on your repository
export const fetchCache = 'force-no-store'; // TODO: remove this line to enable caching but without making the app completely static
export const revalidate = 0;

export default async function pushMultipleFilesToBranch(
  filesArray,
  branch,
  message,
) {
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
      mode: '100644', // blob (file)
      type: 'blob',
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

    console.log('Created commit:', newCommitData.sha);

    // Update the branch reference to point to the new commit
    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommitData.sha,
    });

    console.log('Successfully pushed multiple files to branch:', branch);
    const gitDiffLink = `https://github.com/${owner}/${repo}/compare/${sourceBranch}...${branch}`;
    console.log('gitDiffLink', gitDiffLink);
    return gitDiffLink;
  } catch (error) {
    console.error('Error pushing multiple files to branch:', error);
  }
}
