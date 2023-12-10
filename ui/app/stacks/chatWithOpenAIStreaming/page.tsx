'use client';
import StreamOpenAI from '@/app/components/StreamOpenAI';
import ClipboardComponent from '@/app/components/clipboard';
import tw from 'tailwind-styled-components';
import Link from 'next/link';
import { IoLogoGithub } from 'react-icons/io';

// Chat component
const Chat = () => {
  return (
    <Container>
      <Link
        className="cursor-pointer absolute bottom-4 right-4"
        href="https://github.com/stackwiseai/stackwise"
        target="_blank"
      >
        <IoLogoGithub className="w-8 h-8" />
      </Link>
      <TitleContainer>
        <div className="w-full mb-4 flex justify-center">
          <img className="w-32" src="/stackwise_logo.png" />
        </div>
        <Subtitle>Vercel edge function for OpenAI response streaming.</Subtitle>
      </TitleContainer>
      <div className="flex space-x-6">
        <ClipboardComponent
          title={
            <>
              Copy <b className="text-black">Frontend</b>
            </>
          }
          path="/stacks/chatWithOpenAIStreaming/frontend.txt"
        />
        <ClipboardComponent
          title={
            <>
              Copy <b className="text-black">Backend</b>
            </>
          }
          path="/stacks/chatWithOpenAIStreaming/backend.txt"
        />
      </div>
      <MainWrapper>
        <StreamOpenAI />
      </MainWrapper>
    </Container>
  );
};

export default Chat;

const Container = tw.div`
  flex
  flex-col
  justify-center
  items-center
  h-screen
  space-y-6
`;

const TitleContainer = tw.div`
  text-center
  flex
  flex-col
  items-center
  h-[45%]
  justify-end
  w-1/2
`;
const Subtitle = tw.p`
  text-lg
`;

const MainWrapper = tw.div`
  w-1/2
  flex
  flex-col
  items-center
  h-[55%]
`;
