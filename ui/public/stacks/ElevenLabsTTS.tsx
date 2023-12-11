'use client';
import ClipboardComponent from '@/app/components/clipboard';
import React, { useState } from 'react';

// Chat component
const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [generatedFileContents, setGeneratedFileContents] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Submitting:', inputValue);
    if (inputValue.trim()) {
      console.log('Submitting:', inputValue);
      playText(inputValue.trim());
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gray-100">
      <div className="w-full max-w-xs mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type here..."
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onKeyDown={(e) => {
              if (e.key === 'Enter')
                handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
            }}
          />
          <button
            type="submit"
            className={`mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            Submit
          </button>
          {loading && (
            <span className="text-sm text-gray-500 mt-2">
              Might take a minute or 2 ...{' '}
            </span>
          )}
          {/* {loading && LoadingComponent()} */}
          <div className="mt-4">{generatedFileContents}</div>
        </form>
      </div>
      <>
        <span className="text-sm text-gray-500 mt-2">Copy FrontEnd</span>
        <ClipboardComponent code="/stacks/chatWithOpenAIStreaming/frontend.txt" />
        <span className="text-sm text-gray-500 mt-2">Copy Backend</span>
        <ClipboardComponent code="/stacks/chatWithOpenAIStreaming/backend.txt" />
      </>
    </div>
  );
};

async function playText(text: string) {
  const response = await fetch('/api/elevenLabsTTS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error('Speech generation failed');
  }

  const audioContext = new window.AudioContext();
  const audioData = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(audioData);

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start();

  source.onended = () => {
    audioContext.close();
  };
}

export default Chat;
