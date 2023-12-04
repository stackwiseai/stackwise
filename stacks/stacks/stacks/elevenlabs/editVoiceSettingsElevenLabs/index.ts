type body = {
  similarity_boost: number;
  stability: number;
  style: number;
  use_speaker_boost: boolean;
};

/**
 * Brief: Edit settings for a specific voice.
 */

export default async function editVoiceSettings(
  method: string,
  body: body,
  voice_id: string
): Promise<any> {
  const options = {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  try {
    const data = fetch(
      `https://api.elevenlabs.io/v1/${voice_id}/settings/edit`,
      options
    )
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));

    return data;
  } catch (error) {
    console.error(error);
  }
}
