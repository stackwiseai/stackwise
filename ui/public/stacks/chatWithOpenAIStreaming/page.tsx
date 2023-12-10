'use client';
import SubmitForm from '@/app/components/SubmitForm';
import ClipboardComponent from '@/app/components/clipboard';
import React, { useState } from 'react';
import tw from 'tailwind-styled-components';

// Chat component
const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [generatedFileContents, setGeneratedFileContents] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Submitting:', inputValue);
    if (inputValue.trim()) {
      setGeneratedFileContents('');
      setLoading(true);

      try {
        const response = await fetch('/api/chatWithOpenAIStreaming', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: inputValue }),
        });
        const data = await response.body;

        if (!data) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let fullContent = '';

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value, { stream: !done });
          setGeneratedFileContents((prev) => prev + chunkValue);
          setLoading(false);
          fullContent += chunkValue;
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      } finally {
        setInputValue(''); // Clear the input field
        setLoading(false);
      }
    }
  };

  return (
    <Container>
      <TitleContainer>
        <div className="mb-4 flex">
          <img className="w-32" src="/stackwise_logo.png" />
          {/* <div>Github</div> */}
        </div>
        <Subtitle>Vercel edge function for OpenAI response streaming.</Subtitle>
      </TitleContainer>
      <MainWrapper>
        <SubmitForm
          handleSubmit={handleSubmit}
          inputValue={inputValue}
          setInputValue={setInputValue}
          loading={loading}
        />
        <div className="mt-4 min-h-4 p-4 w-full rounded bg-[#faf0e6]">
          {loading ? (
            <span className="text-sm text-gray-400">
              Might take a minute or 2 ...{' '}
            </span>
          ) : generatedFileContents ? (
            generatedFileContents
          ) : (
            <p className="text-gray-400 text-sm">Output here...</p>
          )}
        </div>
        <>
          <span className="text-sm text-gray-500 mt-2">Copy FrontEnd</span>
          <ClipboardComponent path="/stacks/chatWithOpenAIStreaming/page.tsx" />
          <span className="text-sm text-gray-500 mt-2">Copy Backend</span>
          <ClipboardComponent path="/stacks/chatWithOpenAIStreaming/route.ts" />
        </>
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
`;

const TitleContainer = tw.div`
  text-center
  mb-8
  flex
  flex-col
  items-center
`;
const Subtitle = tw.p`
  text-lg
`;

const MainWrapper = tw.div`
  w-1/2
  flex
  flex-col
  justify-center
  items-center
`;
