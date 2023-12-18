'use client';

import React, { useState } from 'react';
import ClipboardComponent from '@/app/components/clipboard';
import { IoSend } from 'react-icons/io5';

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
    <div className="w-3/4 md:w-1/2">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="relative w-full">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything..."
            className="focus:shadow-outline w-full rounded-full border border-gray-400 py-2 pl-4 pr-10 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter')
                handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
            }}
          />
          <button
            type="submit"
            className={`focus:shadow-outline absolute right-0 top-0 h-full cursor-pointer rounded-r-full px-4 font-bold text-black focus:outline-none ${
              loading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={loading}
          >
            <IoSend />
          </button>
        </div>
      </form>
    </div>
  );
};

async function playText(text: string) {
  const response = await fetch('/api/elevenlabs-tts', {
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
