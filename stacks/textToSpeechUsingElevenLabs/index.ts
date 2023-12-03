const ElevenLabs = require("elevenlabs-node");

export default async function LetYourCuriosityGuideYou(): Promise<any> {
  try {
    const voice = new ElevenLabs({
      apiKey: "5deb1d4cc1b76bd25e7188ebfda883c5",
      voiceId: "pNInz6obpgDQGcFmaJgB",
    });

    const response = await voice.textToSpeech({
      fileName: "textToSpeechUsingElevenLabs/audio.mp3",
      textInput: "Let your curiosity guide you",
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
