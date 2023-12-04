import * as vscode from 'vscode';
import buildStack from '../stack/buildStack';
import createStackFile from '../stack/createStackFile';
import replaceStackSnippetWithInjectFunction from '../collapseStack';
import addImportStatement from '../addImportStatement';
import chooseBoilerplate from '../stack/integrations/generic/chooseBoilerplate';
import generateFunction from '../stack/integrations/generic/generateFunction';
import createBoilerplateEmbedding from '../stack/createEmbedding/boilerplateEmbedding';
import { BoilerplateMetadata } from '../stack/integrations/lib/types';
import updateEmbedding from '../stack/updateEmbedding';
import stackRegistry from '../stack/registry';
import { combineSkeleton, insertMethodName } from '../stack/createSkeleton';
import createMethodName from '../stack/createMethodName';

export default async function buildOrUpdateStack(
  stackSnippet,
  stackPosition,
  stackIntegration: string | null,
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
    inputString,
    briefSkeleton,
    functionAndOutputSkeleton,
    inputValues,
  } = await buildStack({
    inputJSON: inputJSON,
    outputJSON: outputJSON,
    stackSnippet: stackSnippet,
  });

  const fullSkeleton = combineSkeleton(
    briefSkeleton,
    functionAndOutputSkeleton
  );

  let integrationType: string = 'generic';
  let userSpecifiedIntegration: boolean = false; // purely so exact match doesnt override it
  if (stackIntegration) {
    integrationType = stackIntegration;
    userSpecifiedIntegration = true;
  }

  let methodName;
  if (!functionExists) {
    console.log(`function does not exist yet`);
    // embedding is null if exactMatch is true
    const { nearestBoilerplate, integration, exactMatch, embedding } =
      await chooseBoilerplate(fullSkeleton, functionId, integrationType);

    if (!userSpecifiedIntegration) {
      // purely so exact match doesnt override it
      integrationType = integration;
    }

    if (exactMatch) {
      console.log(`exactMatch of functionId ${functionId}`);
      // if it's an exact match it means that's it's a single BoilerplateMetadata (hash directly matched or >0.98 similarity)
      const boilerplate = nearestBoilerplate as BoilerplateMetadata;
      methodName = boilerplate.methodName;

      createStackFile(boilerplate.functionString, methodName, integrationType);
      // increment count of times it's been used and what it was retrieved by
      await updateEmbedding(boilerplate, functionId);
    } else {
      console.log(`NO exact match for the functionId ${functionId}`);

      let { updatedMethodName, updatedFunctionAndOutputSkeleton } =
        await createMethodName(briefSkeleton, functionAndOutputSkeleton, brief);
      methodName = updatedMethodName;

      // generate a function from the default values
      let generatedFunction = await generateFunction(
        briefSkeleton,
        updatedFunctionAndOutputSkeleton,
        brief,
        nearestBoilerplate,
        integrationType,
        embedding
      );

      generatedFunction = combineSkeleton(briefSkeleton, generatedFunction);
      generatedFunction = insertMethodName(methodName, generatedFunction);

      console.log(
        `generatedFunction in buildOrUpdateStack:`,
        generatedFunction
      );

      // save it as an embedding
      await createBoilerplateEmbedding(
        brief,
        inputJSON,
        outputJSON,
        integrationType,
        functionId,
        generatedFunction,
        methodName,
        fullSkeleton
      );

      createStackFile(generatedFunction, methodName, integrationType);
    }

    stackRegistry.register(methodName, functionId);
  } else {
    methodName = stackRegistry.idExists(functionId);
    console.log(`function already exists`);
  }
  console.log(`inputString in buildOrUpdateStack:`, inputString);

  const injectedFunction = `await ${methodName}(${inputValues})`;

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
