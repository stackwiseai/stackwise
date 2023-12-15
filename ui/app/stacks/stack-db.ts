export type StackDescription = {
  name: string;
  description: string;
  tags: string[];
};

export const stackDB: Record<string, StackDescription> = {
  'chat-with-openai-streaming': {
    name: 'Chat With GPT-3.5 Streaming',
    description: 'Vercel edge function for OpenAI response streaming.',
    tags: ['verified'],
  },
  'elevenlabs-tts': {
    name: 'Text to Speech using ElevenLabs',
    description: 'Text to Speech using ElevenLabs and Vercel edge functions',
    tags: ['verified'],
  },
  'get-image-description-openai': {
    name: 'Get Image Description OpenAI',
    description: 'Description of an image using OpenAI Vision',
    tags: ['verified'],
  },
  'use-openai-assistant': {
    name: 'Use OpenAI Assistant',
    description: 'OpenAI assistant endpoint.',
    tags: ['verified'],
  },
  'create-ai-canvas': {
    name: 'Create AI Canvas',
    description:
      'Real time image rendering using Fal. Draw on the left canvas and add a prompt.',
    tags: ['verified'],
  },
  'chat-with-openai-streaming-helicone': {
    name: 'Chat With GPT-3.5 Streaming Helicone',
    description:
      'Vercel edge function for OpenAI response streaming with Helicone',
    tags: ['published'],
  },
  'stable-video-diffusion': {
    name: 'Stable Video Diffusion',
    description: 'Animate image backgrounds using Fal.',
    tags: ['verified'],
  },
  'chat-with-gemini': {
    name: 'Chat with Gemini',
    description: 'Chat with Gemini',
    tags: ['published'],
  },
  'rag-pdf-with-langchain': {
    name: 'RAG PDF with Langchain',
    description: `Ask questions about any PDF using Langchain's ConversationalRetrievalQAChain (RAG).`,
    tags: [],
  },
  'chat-with-gemini-langchain': {
    name: 'Chat Gemini Langchain',
    description: 'Chat with Gemini Using Langchain',
    tags: ['published'],
  },
  'chat-with-gemini-streaming': {
    name: 'Chat Gemini Streaming',
    description: 'Chat with Gemini Using Streaming',
    tags: ['published'],
  },
  // 'load-ts-react-component': {
  //   name: 'Load a react component',
  //   description: 'Chat with Gemini Using Streaming',
  //   tags: ['published'],
  // },
};

export const statusesToDisplay = ['verified', 'published'];
