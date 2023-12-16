import { v4 as uuidv4 } from 'uuid';
import { pushStackToGithub } from './push-stack-to-github';

export async function POST(req) {
  const json = await req.json();
  console.log(json);
  const { fileContent, stackName } = json;
  const generatedUuid = uuidv4();
  const randomChars = generatedUuid.replace(/-/g, '').substring(0, 7);
  const actualStackName = `${stackName}-${randomChars}`;
  const path = `ui/app/components/stacks/${actualStackName}.tsx`;
  const message = `Building ${actualStackName}`;
  const responseJson = await pushStackToGithub(fileContent, path, message);

  return Response.json(responseJson);
}
