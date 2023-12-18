import { useState } from 'react';
import { IoSend } from 'react-icons/io5';
import ReactMarkdown from 'react-markdown';

export const ChatWithOpenAIStreamingMarkdown = () => {
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
        const response = await fetch('/api/chat-with-gemini-langchain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: inputValue }),
        });
        const data = await response.json();
        console.log('data', data);
        if (!data) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setGeneratedFileContents(data.output);
      } catch (error) {
        console.error('Error during fetch:', error);
      } finally {
        setInputValue(''); // Clear the input field
        setLoading(false);
      }
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
      <div className="min-h-4 mt-4 max-h-96 w-full overflow-auto rounded-md bg-[#faf0e6] p-4 md:max-h-[28rem]">
        {loading ? (
          <span className="text-sm text-gray-400">Generating... </span>
        ) : generatedFileContents ? (
          <ReactMarkdown>{generatedFileContents}</ReactMarkdown>
        ) : (
          <p className="text-sm text-gray-400">Output here...</p>
        )}
      </div>
    </div>
  );
};

export default ChatWithOpenAIStreamingMarkdown;
