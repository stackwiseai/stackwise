'use client';
import ClipboardComponent from '@/app/components/clipboard';
import React, { useState } from 'react';
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
            placeholder="Type anything..."
            className="rounded-full w-full py-2 pl-4 pr-10 border border-gray-400 focus:outline-none focus:shadow-outline"
            onKeyDown={(e) => {
              if (e.key === 'Enter')
                handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
            }}
          />
          <button
            type="submit"
            className={`cursor-pointer absolute right-0 top-0 rounded-r-full h-full text-black font-bold px-4 focus:outline-none focus:shadow-outline ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
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
