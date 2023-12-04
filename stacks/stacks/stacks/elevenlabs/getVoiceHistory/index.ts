/**
 * Brief: Gets metadata about all your generated audio.
 */

export default async function getVoiceHistory(
  method: string
): Promise<any> {
  const options = { method: method };

  try {
    const data = fetch("https://api.elevenlabs.io/v1/history", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));

    return data;
  } catch (error) {
    console.error(error);
  }
}
