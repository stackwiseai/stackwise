import * as vscode from 'vscode';
import buildStack from '../stack/buildStack';
import { createStackFile } from '../extension';
import replaceStackSnippetWithInjectFunction from '../collapseStack';
import addImportStatement from '../addImportStatement';
import extractInputString from '../stack/jsonify/extractInputString';
import chooseBoilerplate from '../stack/integrations/generic/chooseBoilerplate';
import generateFunction from '../stack/integrations/generic/generateFunction';
import createBoilerplateEmbedding from '../stack/createEmbedding';
import { BoilerplateMetadata } from '../stack/integrations/lib/types';
import { incrementEmbeddingCount } from '../stack/integrations/lib/incrementEmbeddingCount';
import stackRegistry from '../stack/registry';
import { combineSkeleton } from '../stack/createSkeleton';

export default async function buildOrUpdateStack(
  stackSnippet,
  stackPosition,
  inputJSON,
  outputJSON,
  document: vscode.TextDocument
) {
  const message = vscode.window.showInformationMessage(
    `Building your stack...`
  );

  const {
    brief,
    functionId,
    functionExists,
    methodName,
    inputString,
    briefSkeleton,
    functionAndOutputSkeleton,
  } = await buildStack({
    inputJSON: inputJSON,
    outputJSON: outputJSON,
    stackSnippet: stackSnippet,
  });

  let integrationType = 'generic';

  console.log(`functionId in buildOrUpdateStack:`, functionId);
  if (!functionExists) {
    console.log(`function does not exist yet`);
    const { nearestBoilerplate, integration, exactMatch } =
      await chooseBoilerplate(
        briefSkeleton,
        functionAndOutputSkeleton,
        functionId
      );

    integrationType = integration;

    console.log(
      `nearestBoilerplate in buildOrUpdateStack:`,
      nearestBoilerplate
    );
    console.log(`integration in buildOrUpdateStack:`, integration);
    console.log(`exactMatch in buildOrUpdateStack:`, exactMatch);

    if (exactMatch) {
      console.log(`exactMatch of functionId ${functionId}`);
      // if it's an exact match it means that's it's a single BoilerplateMetadata (hash directly matched or >0.98 similarity)
      const boilerplate = nearestBoilerplate as BoilerplateMetadata;
      // this replaces the previous function name with the new one
      const existingFunction = boilerplate.functionString.replace(
        new RegExp(methodName, 'g'),
        boilerplate.methodName
      );
      createStackFile(existingFunction, methodName, integration);
      // increment count of times it's been used
      await incrementEmbeddingCount(boilerplate.functionId);
    } else {
      console.log(`NO exact match for the functionId ${functionId}`);

      // generate a function from the default values
      let generatedFunction = await generateFunction(
        briefSkeleton,
        functionAndOutputSkeleton,
        brief,
        nearestBoilerplate,
        integration
      );

      generatedFunction = combineSkeleton(briefSkeleton, generatedFunction);

      console.log(
        `generatedFunction in buildOrUpdateStack:`,
        generatedFunction
      );

      // save it as an embedding
      await createBoilerplateEmbedding(
        brief,
        inputJSON,
        outputJSON,
        integration,
        functionId,
        generatedFunction,
        methodName,
        briefSkeleton,
        functionAndOutputSkeleton
      );

      createStackFile(generatedFunction, methodName, integration);
    }

    stackRegistry.register(methodName, functionId);
  } else {
    console.log(`function already exists`);
  }

  const inputStringToArgument = extractInputString(stackSnippet);
  const injectedFunction = `await ${methodName}(${inputStringToArgument})`;

  console.log(`stackSnippet in buildOrUpdateStack:`, stackSnippet);
  // console.log(`document in buildOrUpdateStack:`, document);
  console.log(`injectedFunction in buildOrUpdateStack:`, injectedFunction);

  replaceStackSnippetWithInjectFunction(
    stackSnippet,
    document,
    injectedFunction
  );
  addImportStatement(methodName, document, integrationType);
}
