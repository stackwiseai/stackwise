export default async function getFileFromGithub(path) {
  const owner = 'stackwiseai';
  const repo = 'stackwise';
  const sourceBranch = process.env.VERCEL_GIT_COMMIT_REF ?? ''; // or 'master', depending on your repository

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${sourceBranch}`;
  console.log(url, 'url');
  const response = await fetch(url, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });
  return response.json();
}
