import { readFileSync } from "fs";
import { getSupabaseClient } from "@/app/stacks/stack-db";

import { pushStackToGithub } from "../modify-frontend-component/push-stack-to-github";

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
    throw error;
  }

  let path = `ui/app/components/stacks/${data.id}.tsx`;
  let message = `Frontend For Stack ${data.id} created`;
  let content = readFileSync(
    `app/components/stacks/boilerplate-basic.tsx`,
    "utf8",
  );
  await pushStackToGithub(content, path, message);

  path = `ui/api/${data.id}/route.ts`;
  message = `Backend For Stack ${data.id} created`;
  content = readFileSync(`app/api/boilerplate-basic/route.ts`, "utf8");
  await pushStackToGithub(content, path, message);

  path = `ui/public/stack-pictures/${data.id}.png`;
  message = `Image For Stack ${data.id} created`;
  const { sha: shaImage } = await getFileFromGithub(
    "ui/public/stack-pictures/boilerplate-basic.png",
  );
  await pushStackToGithub(shaImage, path, message, true);

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
// import { getSupabaseClient } from '@/app/stacks/stack-db';
// import { modifyFrontEndComponent } from '../modify-frontend-component/route';
// import { readFileSync } from 'fs';

// const frontEndFileContent = readFileSync(
//   `/app/components/stacks/boilerplate-basic.tsx`,
//   'utf8'
// );

// export async function POST(req: Request) {
//   try {
//     //get the token from header and strip the Bearer
//     const token = req.headers.get('Authorization').split(' ')[1];

//     const supabase = await getSupabaseClient(token);

//     // add a field to data
//     const data = await req.json();
//     data.tags = ['draft'];

//     const { data: insertedData, error } = await supabase
//       .from('stack')
//       .insert([data])
//       .single();

//     const responseJson = await modifyFrontEndComponent(
//       frontEndFileContent,
//       data.id,
//       false
//     );

//     if (error) {
//       throw error;
//     }

//     await supabase.rpc('commit');

//     // Return a success response
//     return new Response(JSON.stringify(insertedData), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     console.error('Error during data insertion:', error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// }

// import { getSupabaseClient } from '@/app/stacks/stack-db';
// import { modifyFrontEndComponent } from '../modify-frontend-component/route';
// import { readFileSync } from 'fs';

// const frontEndFileContent = readFileSync(
//   `/app/components/stacks/boilerplate-basic.tsx`,
//   'utf8'
// );

// export async function POST(req: Request) {
//   try {
//     //get the token from header and strip the Bearer
//     const token = req.headers.get('Authorization').split(' ')[1];

//     const supabase = await getSupabaseClient(token);

//     // add a field to data
//     const data = await req.json();
//     data.tags = ['draft'];

//     const { data: insertedData, error } = await supabase
//       .from('stack')
//       .insert([data])
//       .single();

//     const responseJson = await modifyFrontEndComponent(
//       frontEndFileContent,
//       data.id,
//       false
//     );

//     if (error) {
//       throw error;
//     }

//     await supabase.rpc('commit');

//     // Return a success response
//     return new Response(JSON.stringify(insertedData), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     console.error('Error during data insertion:', error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// }
