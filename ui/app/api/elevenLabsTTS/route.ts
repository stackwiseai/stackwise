import fs from 'fs';
import { Readable } from 'stream';

const voice = require('elevenlabs-node');
const axios = require('axios');

// export const runtime = 'edge'
const elevenLabsAPI = 'https://api.elevenlabs.io/v1';

// Need to adapt from elevenlabs-node because of https://github.com/FelixWaweru/elevenlabs-node/issues/16
const textToSpeech = async (
  apiKey: string | undefined,
  voiceID: string,
  fileName: string,
  textInput: string,
  stability?: number,
  similarityBoost?: number,
  modelId?: string
) => {
  try {
    if (!apiKey || !voiceID || !fileName || !textInput) {
      console.log(
        'ERR: Missing parameter',
        apiKey,
        voiceID,
        fileName,
        textInput
      );
    }

    const voiceURL = `${elevenLabsAPI}/text-to-speech/${voiceID}`;
    const stabilityValue = stability ? stability : 0;
    const similarityBoostValue = similarityBoost ? similarityBoost : 0;

    const response = await axios({
      method: 'POST',
      url: voiceURL,
      data: {
        text: textInput,
        voice_settings: {
          stability: stabilityValue,
          similarity_boost: similarityBoostValue,
        },
        model_id: modelId ? modelId : undefined,
      },
      headers: {
        Accept: 'audio/mpeg',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      responseType: 'stream',
    });

    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(fileName);
      response.data.pipe(writeStream);

      writeStream.on('finish', () => resolve(fileName));
      writeStream.on('error', reject);
    });
  } catch (error) {
    console.log(error);
  }
};

export async function POST(req: Request) {
  const json = await req.json();
  console.log(json);
  const { input } = json;

  const apiKey = process.env.ELEVEN_LABS_API_KEY;
  const voiceID = 'ErXwobaYiN019PkySvjV';
  const filePath = '/tmp/audio.mp3';

  try {
    await textToSpeech(apiKey, voiceID, filePath, input).then((res) => {
      console.log(res);
    });
    // Stream the audio file
    // Create the stream from the audio file
    const audioStream = fs.createReadStream(filePath);

    audioStream.on('end', () => {
      fs.unlinkSync(filePath); // Delete the file after streaming
    });

    // @ts-ignore
    const response = new Response(Readable.from(audioStream), {
      headers: { 'Content-Type': 'audio/mpeg' },
    });
    return response;
  } catch (error) {
    console.error(error);
    // res.status(500).json({error: 'Error generating audio'});
  }
}
