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
    <div className="flex flex-col h-screen justify-center items-center">
      <div className="w-2/3 mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="relative w-full">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type here..."
              className="rounded-full w-full py-4 pl-4 pr-10 border border-gray-400 focus:outline-none focus:shadow-outline text-xl"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(
                    e as unknown as React.FormEvent<HTMLFormElement>
                  );
                }
              }}
            />
          </div>
          <div className="mt-4 min-h-4 p-4 w-full overflow-auto rounded-md bg-[#faf0e6]">
            {loading ? (
              <span className="text-sm text-gray-400">Generating... </span>
            ) : generatedFileContents ? (
              generatedFileContents
            ) : (
              <p className="text-gray-400 text-sm">Output here...</p>
            )}
          </div>
        </form>
      </div>
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
