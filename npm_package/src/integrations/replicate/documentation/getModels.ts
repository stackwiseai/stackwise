import fetch from 'node-fetch';
import Replicate from 'replicate';
import { Page, Model } from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function listReplicateModels() {
  try {
    let models = [];
    let nextUrl = null;

    let response: Page<Model> = await replicate.models.list();

    console.log('response', response);

    do {
      // Filter models with more than 500 runs and add them to the models list
      const filteredModels = response.results
        .filter(model => model.run_count > 500)
        .map(model => {
          if (model?.latest_version?.id) {
            // Reshape each model's JSON structure
            return {
              url: model.url,
              name: model.name,
              default_example: model?.default_example?.input, // Collapse into just default_example
              model: model.name,
              version: model.latest_version.id,
              time_created: model.latest_version.created_at,
              description: model.description,
              run_count: model.run_count,
            };
          }
        });

      models.push(...filteredModels);

      // Update the nextUrl for the next iteration
      nextUrl = response.next;

      // Check if there is a next page and update the response
      if (nextUrl) {
        response = (await fetch(nextUrl, {
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          },
        }).then(res => res.json())) as Page<Model>;
      }

      console.log('response two TWO TWO TOW O TWOT WO OWO O OO', response);
    } while (nextUrl);

    return models;
  } catch (error) {
    console.error('Error querying Replicate:', error);
    throw error;
  }
}
