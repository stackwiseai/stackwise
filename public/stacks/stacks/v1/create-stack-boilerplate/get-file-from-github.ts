export default async function getFileFromGithub(path, token) {
  const owner = 'stackwiseai';
  const repo = 'stackwise';
  const sourceBranch = process.env.VERCEL_GIT_COMMIT_REF ?? ''; // or 'master', depending on your repository

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=main`;
  console.log(url, 'url');
  const response = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  return response.json();
}
