const API_KEY = process.env.PUBLIC_ELEVENLABS_APIKEY ?? "";

/**
 * Brief: Get Model Details using ElevenLabs API
 */
export default async function getModelDetails(modelId: string): Promise<any> {
  return fetch(`https://api.elevenlabs.io/v1/models/${modelId}`, {
    headers: {
      "xi-api-key": API_KEY,
    },
  }).then((response) => response.json());
}
