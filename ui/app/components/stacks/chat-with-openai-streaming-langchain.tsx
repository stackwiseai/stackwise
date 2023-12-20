import React, { useState, useEffect } from 'react';
import { IoSend } from 'react-icons/io5';
import { useChat } from 'ai/react'; 


export const ChatWithOpenAIStreaming = () => {
  const [inputValue, setInputValue] = useState('');
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat-with-openai-streaming-langchain'
  });
 
  const [loading, setLoading] = useState(false);
  const [generatedResponses, setGeneratedResponses] = useState<string[]>([]);
 
  const generatedFileContents = generatedResponses.join('');
 
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
 
    try {
      await handleSubmit(event);
      setInputValue('');
    } finally {
      setLoading(false);
    }
  };
 
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.currentTarget instanceof HTMLFormElement) {
        try {
          await handleFormSubmit({ ...e, currentTarget: e.currentTarget });
        } catch (error) {
        }
      }
    }
  };
  
  useEffect(() => {
    const aiMessages = messages.filter((m) => m.role === 'assistant');
    const newResponses = aiMessages.map((m) => m.content);
    setGeneratedResponses((prevResponses) => [...prevResponses, ...newResponses]);
  }, [messages]);
 
  return (
    <div className="w-3/4 md:w-1/2">
      <form onSubmit={handleFormSubmit} className="flex flex-col">
        <div className="relative w-full">
          <input
            type="text"
            value={inputValue || input}
            onChange={(e) => {
              setInputValue(e.target.value);
              handleInputChange(e);
            }}
            placeholder="Ask anything..."
            className="focus:shadow-outline w-full rounded-full border border-gray-400 py-2 pl-4 pr-10 focus:outline-none"
            onKeyDown={handleKeyDown}
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
          generatedFileContents
        ) : (
          <p className="text-sm text-gray-400">Output here...</p>
        )}
      </div>
    </div>
  );
 };
 
 export default ChatWithOpenAIStreaming;
 
 