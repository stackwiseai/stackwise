import React, { useState, useEffect } from 'react';
import { IoSend } from 'react-icons/io5';
import { useChat } from 'ai/react'; 

export const ChatWithOpenAIStreaming = () => {
  const [inputValue, setInputValue] = useState('');
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat-with-openai-streaming-langchain'
  });

  const [loading, setLoading] = useState(false);

  const latestAssistantResponse = messages
    .filter((m) => m.role === 'assistant')
    .map((m) => m.content)
    .pop(); 

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await handleSubmit(event);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (latestAssistantResponse !== undefined) {
      setInputValue('');
    }
  }, [latestAssistantResponse]);

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
           onKeyDown={(e) => {
             if (e.key === 'Enter') handleFormSubmit(e);
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
         ) : latestAssistantResponse ? (
          latestAssistantResponse
        ) : (
         <p className="text-sm text-gray-400">Output here...</p>
       )}
     </div>
   </div>
 );
};

export default ChatWithOpenAIStreaming;
