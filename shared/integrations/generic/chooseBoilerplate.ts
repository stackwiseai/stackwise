import path from 'path';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { getEmbedding } from '../../createEmbedding/getEmbedding';
import { readExplainFiles } from '../lib/utils';
import { BoilerplateMetadata } from '../lib/types';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
  environment: process.env.PINECONE_ENVIRONMENT as string,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface OutputType {
  nearestBoilerplate: BoilerplateMetadata | BoilerplateMetadata[] | null;
  integration: string;
  exactMatch: boolean;
  embedding?: number[];
}

export default async function chooseBoilerplate(
  fullSkeleton: string,
  functionId: string,
  brief: string
): Promise<OutputType> {
  // decide if there's an integration required

  const index = pinecone.index('general');

  // First, try to retrieve the vector by functionId
  const fetchResult = await index.fetch([functionId]);
  if (fetchResult.records.length) {
    console.log('Found exact match in chooseBoilerplate', fetchResult);
    const match = fetchResult.records[functionId]
      .metadata as BoilerplateMetadata;
    return {
      nearestBoilerplate: match,
      integration: match.integration,
      exactMatch: true,
    };
  }

  // otherwise, try to find the closest match
  const embedding = await getEmbedding(fullSkeleton);

  // Query the index with the embedding to find the top 5 closest matches
  const queryResponse = await index.query({
    vector: embedding,
    filter: { type: 'boilerplate' },
    topK: 3,
    includeMetadata: true,
  });

  console.log('Query response in chooseBoilerplate:', queryResponse);

  // Extract matches from the query response
  const matches = queryResponse.matches;

  // Check for a highly similar match (similarity > 0.98)
  const highlySimilarMatch = matches.find((match) => match.score > 0.98);
  if (highlySimilarMatch) {
    console.log('Found highly similar match');
    const match = highlySimilarMatch.metadata as BoilerplateMetadata;
    return {
      nearestBoilerplate: match,
      integration: match.integration,
      exactMatch: true,
    };
  }

  // Check for matches with similarity above 0.85
  const similarMatches = matches.filter((match) => match.score > 0.85);
  if (similarMatches.length) {
    console.log('Found similar match(es)');
    const match = similarMatches.map(
      (match) => match.metadata
    ) as BoilerplateMetadata[];
    return {
      nearestBoilerplate: match,
      integration: match[0].integration,
      exactMatch: false,
      embedding,
    };
  } else {
    console.log('No similar matches found, using OpenAI to choose integration');
    // Otherwise, figure out what integration to use
    const integrationStrings = await readExplainFiles(
      path.join(__dirname, '..')
    );

    let integration = '';
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert and figuring out what the correct integration for a user request is. This can either be a specific integration required based on desired functionality. Below you will be given a skeleton of a function along with the desired input and output types. You will also be given a brief description of what the function should do. Your job is to choose which integrations you should use to satisfy the skeleton and brief description.
The skeleton of the function is: ${fullSkeleton}`,
          },
          {
            role: 'system',
            content: `Your choices for potential starting points are: ${integrationStrings}`,
          },
          {
            role: 'system',
            content: `Now, choose which of the above integrations which may be useful in creating the function. If you don't think that any of the functionalities are needed, just respond with 'generic'. Here are some examples

Example 1:
User: Summarize key points from a lengthy conference video.
Rationale: This requires first converting the video content into text, possibly through speech-to-text technology, and then summarizing the textual content.
Response: replicate, openai

Example 2:
User: Identify similar artworks in a digital art collection.
Rationale: First we need to get the image embedding, then we need to compare to images in the Pinecone index.
Response: replicate, pinecone

Example 3:
User: Multiply two numbers together
Rationale: There is not integration required, it is just logic.
Response: generic

Only respond with either 'generic' or the names of the above integrations. Do not under any circumstances respond with anything else, other then a list of integrations separated by a comma.

User: ${brief}`,
          },
        ],
        temperature: 0,
      });

      integration = response.choices[0].message.content;
      console.log('Integration chosen:', integration);
    } catch (error) {
      console.log('Error querying OpenAI:', error);
    }

    return {
      nearestBoilerplate: null,
      integration: integration,
      exactMatch: false,
      embedding,
    };
  }
}
