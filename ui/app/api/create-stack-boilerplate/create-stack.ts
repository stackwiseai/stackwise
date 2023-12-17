import { getSupabaseClient } from "@/app/stacks/stack-db";

import getFileFromGithub from "./get-file-from-github";
import pushMultipleFilesToBranch from "./push-multiple-files-to-branch";

export default async function createStack(data) {
  const supabase = await getSupabaseClient();

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
  message = `Stack ${data.id} created`;

  response = await getFileFromGithub(
    "ui/public/stack-pictures/boilerplate-basic.png",
  );

  filesArray.push({
    path: path,
    sha: response.sha,
  });
  const sourceBranch = process.env.VERCEL_GIT_COMMIT_REF ?? ""; // or 'master', depending on your repository

  await pushMultipleFilesToBranch(filesArray, sourceBranch, message);

  await supabase.rpc("commit");
}
