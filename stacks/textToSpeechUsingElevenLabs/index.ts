const ElevenLabs = require("elevenlabs-node");
import * as dotenv from "dotenv";
dotenv.config();

interface IconvertTTS {
  text: string;
  pathToAudio: string;
}

export default async function convertTTS({
  text,
  pathToAudio,
}: IconvertTTS): Promise<any> {
  try {
    const voice = new ElevenLabs({
      apiKey: process.env.API_KEY as string,
      voiceId: "pNInz6obpgDQGcFmaJgB",
    });

    console.log(process.env.API_KEY);

    const response = await voice.textToSpeech({
      fileName: pathToAudio + "audio.mp3",
      textInput: text,
      stability: 0.5,
      similarityBoost: 0.5,
      style: 1,
      speakerBoost: true,
    });

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
