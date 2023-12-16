import { IoSend } from 'react-icons/io5';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export const ChatWithOpenAIStreaming = () => {
  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Submitting:', inputValue);
    if (inputValue.trim()) {
      setOutput('');
      setLoading(true);

      const response = await fetch('/api/chat-with-gemini-streaming', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: inputValue }),
      });
      const data = await response.json();
      setOutput(data.output);
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
      <div className="mt-4 min-h-4 p-4 max-h-96 md:max-h-[28rem] overflow-auto w-full rounded-md bg-[#faf0e6]">
        {loading ? (
          <span className="text-sm text-gray-400">Generating... </span>
        ) : output ? (
          <ReactMarkdown>{output}</ReactMarkdown>
        ) : (
          <p className="text-gray-400 text-sm">Output here...</p>
        )}
      </div>
    </div>
  );
};

export default ChatWithOpenAIStreaming;
