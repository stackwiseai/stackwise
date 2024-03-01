'use client'
import { useState } from 'react';
import { IoSend } from 'react-icons/io5';

export const RapBattle = () => {
  const [topic, setTopic] = useState<any>('');
  const [conversation, setConversation] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const handleInitialSubmit = async (event : any) => {
    event.preventDefault();
    setLoading(true);

    try {
      setLoading(true)
      const res = await fetch('/api/take-1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: topic,
          modelType: 'mixtral', // First line is always by llama2
        }),
      });
      const data = await res.json();
      console.log(data.output)
      setConversation([data.output]);
      setLoading(false)
    } catch (error) {
      console.error(error, 'Failed to send request:', error);
    }

    setLoading(false);
  };

  const getNextLine = async () => {
    setLoading(true);
    const lastLine = conversation[conversation.length - 1] || '';
    const modelType = conversation.length % 2 === 0 ? 'llama2' : 'mixtral'; // Alternate between models

    try {
      const res = await fetch('/api/take-1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: lastLine,
          modelType: modelType,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setConversation([...conversation, data.output]);
      } else {
        console.error('Error from API');
      }
    } catch (error) {
      console.error('Failed to send request:', error);
    }

    setLoading(false);
  };

  return (
    <div className="w-3/4 md:w-1/2">
      <form className="flex flex-col" onSubmit={handleInitialSubmit}>
        <div className="relative w-full">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic for the rap battle"
            className="focus:shadow-outline w-full rounded-full border border-gray-400 py-2 pl-4 pr-10 focus:outline-none"
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
      {loading && <h1>Loading, please wait.... </h1>}
      <div className="flex flex-col mt-4">
        <div className="overflow-auto h-96">
          {conversation.map((line: any, index: any) => (
            <p key={index} className={`my-2 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
              {line}
            </p>
          ))}
        </div>
        {conversation.length > 0 && (
          <button
            onClick={getNextLine}
            className={`mt-4 w-full rounded-full py-2 font-bold text-black focus:outline-none ${
              loading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Next Rap Line'}
            <IoSend className="inline ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default RapBattle;
