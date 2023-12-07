import { Octokit } from "@octokit/rest";
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN});
import axios from 'axios';
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAI } from "langchain/llms/openai";
const owner = 'stackwiseai';
const repo = 'stackwise';
const vercelToken = process.env.VERCEL_TOKEN;
const teamId = process.env.TEAM_ID;  
const repoId = process.env.REPO_ID;
const randomString = generateRandomString(10) 
const branch = `test-${randomString}`;
const openAIAPIKey = process.env.OPENAI_API_KEY;
const heliconeAPIKey = process.env.HELICONE_API_KEY;

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method === 'POST') {
    const codeToChange = await getCurrentCode()
    console.log(codeToChange, req.body.brief)
    const changedCode = await getChangedCode(codeToChange, req.body.brief)
    console.log(changedCode)
    const tsxExtracted = extractTsxOrJsx(changedCode)
    if (!tsxExtracted) {
      throw new Error('No tsx code found in the response')
    }
    console.log(tsxExtracted)
    pushToBranch(tsxExtracted);
    
    // // Send a response back

    // deployToVercel(branch);
    res.status(200).json({ message: 'Brief received successfully' });
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
  
async function pushToBranch(newContent) {
  
  ; // Generates a random string of 10 characters
  const path = 'web/src/app/Home.tsx';
  // const content = Buffer.from(newContent).toString('base64');
  const message = 'Your commit message';
  const defaultBranch = 'main'; // or 'master', depending on your repository
  
  try {
      // Get the SHA of the latest commit on the branch

      let parentSha;
        const { data: defaultBranchData } = await octokit.repos.getBranch({
          owner,
          repo,
          branch: defaultBranch,
      });
      parentSha = defaultBranchData.commit.sha;

    // Create a new branch
    await octokit.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branch}`,
        sha: parentSha,
    });

      // Get the SHA of the tree from the latest commit
      const { data: commitData } = await octokit.git.getCommit({
        owner,
        repo,
        commit_sha: parentSha,
    });
    const treeSha = commitData.tree.sha;

    // Create a new tree with the changes
    const { data: treeData } = await octokit.git.createTree({
        owner,
        repo,
        tree: [{
            path,
            mode: '100644', // blob (file)
            type: 'blob',
            content: newContent,
            encoding: 'base64',
        }],
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

    // Update the branch reference to point to the new commit
    await octokit.git.updateRef({
        owner,
        repo,
        ref: `heads/${branch}`,
        sha: newCommitData.sha,
    });

    console.log('Successfully pushed to branch:', branch);
} catch (error) {
    console.error('Error pushing to branch:', error);
}
}

function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
      'Content-Type': 'application/json'
    },
    data: {
      name: repo,
      gitSource: {
        type: 'github',
        ref: branch,
        repo: `${owner}/${repo}`,
        repoId: repoId
      }
    }
  };

  try {
    const response = await axios(config);
    console.log('Deployment created successfully:', response.data);
    return response.data; // Optional: Return response data if needed
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


async function getCurrentCode() {
  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/web/src/app/Home.tsx`, {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`
      }
    });
    const fileContentBase64 = response.data.content;
    console.log(fileContentBase64);
    const fileContent = Buffer.from(fileContentBase64, 'base64').toString('utf-8');
    console.log(fileContent);
    return fileContent;
  } catch (error) {
    console.error(error);
  }
}


async function getChangedCode(codeToChange, brief) {
  const chat = new ChatOpenAI({
    openAIApiKey: openAIAPIKey,
    maxTokens: 6000,
    modelName: "gpt-4",
    configuration: {
      basePath: "https://oai.hconeai.com/v1",
      defaultHeaders: {
        "Helicone-Auth": `Bearer ${heliconeAPIKey}`,
        },
      },
    }
  )
  
  // llm = ChatOpenAI(openai_api_key='<>',
  //     headers={
  //         "Helicone-Auth": f"Bearer {env.HELICONE_API_KEY}"
  //     },
  //     openai_api_base="https://oai.hconeai.com/v1",
  // )

  // const llm = new OpenAI(
  //   {
  //     openAIApiKey: openAIAPIKey,
  //     maxTokens: 6000,
  //     modelName: "gpt-4"
  //   }
  // );
  return await chat.predict(`
${codeToChange}

${brief}
Please always rewrite the whole file. I repeat, please always rewrite the whole file.
`);
}

function extractTsxOrJsx(inputString) {
  const regex = /```(tsx|jsx)\s*([\s\S]*?)\s*```/; 
  const match = inputString.match(regex);
  return match ? match[2].trim() : inputString;
}