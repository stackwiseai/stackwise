import { Octokit } from '@octokit/rest';

const owner = 'stackwiseai';
const repo = 'stackwise';
const sourceBranch = process.env.VERCEL_GIT_COMMIT_REF ?? ''; // or 'master', depending on your repository
export const fetchCache = 'force-no-store'; // TODO: remove this line to enable caching but without making the app completely static
export const revalidate = 0;

export default async function pushMultipleFilesToBranch(
  filesArray,
  branch,
  token
) {

  const octokit = new Octokit({ auth: token });

  try {
    const response = await octokit.rest.repos.createFork({
      owner,
      repo,
    });

    await octokit.rest.activity.starRepoForAuthenticatedUser({
      owner: owner,
      repo: repo
  });
  const { data: user } = await octokit.users.getAuthenticated();
  const forkedRepoOwner = user.login;
  console.log(user, 'user');
  // wait 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const { data: refData } = await octokit.git.getRef({
      owner: forkedRepoOwner,
      repo: repo,
      ref: `heads/main`
  });
  const sha = refData.object.sha;

    // Create a new branch using the SHA

    try {
      await octokit.git.createRef({
        owner: forkedRepoOwner,
        repo: repo,
        ref: `refs/heads/${branch}`,
        sha: sha
      });
    } catch (error) {
      console.log("branch already exists ");
    }
    
    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];
      const response = await octokit.rest.repos.createOrUpdateFileContents({
        owner: forkedRepoOwner,
        repo,
        path: file.path,
        branch: branch,
        message: file.message,
        content: file.sha,
      });
      //wait .5 seconds
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('response', response);
    }

    const { data } = await octokit.pulls.create({
      owner: "stackwiseai",
      repo,
      title: `Create stack ${branch}`,
      head: `${forkedRepoOwner}:${branch}`,
      base: "main",
      body:"",
    });
    
    return "ok";
  } catch (error) {
    console.error('Error pushing multiple files to branch:', error);
  }
}
