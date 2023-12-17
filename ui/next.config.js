/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/stackwise",
        permanent: true,
      },
      {
        source: "/stacks/gbkm2sk",
        destination: "/stacks/chat-with-openai-streaming",
        permanent: true,
      },
      {
        source: "/stacks/aekmwsk",
        destination: "/stacks/elevenlabs-tts",
        permanent: true,
      },
      {
        source: "/stacks/fedcba5",
        destination: "/stacks/get-image-description-openai",
        permanent: true,
      },
      {
        source: "/stacks/abc1234",
        destination: "/stacks/use-openai-assistant",
        permanent: true,
      },
      {
        source: "/stacks/blkfsSK",
        destination: "/stacks/create-ai-canvas",
        permanent: true,
      },
      {
        source: "/stacks/ayqflsq",
        destination: "/stacks/chat-with-openai-streaming-helicone",
        permanent: true,
      },
      {
        source: "/stacks/e4w5wrc",
        destination: "/stacks/stable-video-diffusion",
        permanent: true,
      },
      {
        source: "/stacks/f2w5orq",
        destination: "/stacks/basic-gemini-vision",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
