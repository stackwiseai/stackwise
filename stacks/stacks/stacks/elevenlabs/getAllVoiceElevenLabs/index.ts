

/**
 * Brief: Gets a list of all available voices
 */

export default async function getListOfVoicesElevenLabs(
  method: string
): Promise<any> {
  const options = { method: method };

  try {
    const data = fetch("https://api.elevenlabs.io/v1/voices", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));

    return data;
  } catch (error) {
    console.error(error);
  }
}
