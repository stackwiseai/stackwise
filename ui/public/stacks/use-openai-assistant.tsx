'use client';

import { Message, experimental_useAssistant as useAssistant } from 'ai/react';
import { useEffect, useRef } from 'react';
import { IoSend } from 'react-icons/io5';

const roleToColorMap: Record<Message['role'], string> = {
  system: 'red',
  user: 'black',
  function: 'blue',
  assistant: 'green',
  data: 'orange',
};

export default function Chat() {
  const { status, messages, input, submitMessage, handleInputChange, error } =
    useAssistant({
      api: '/api/use-openai-assistant',
    });

  // When status changes to accepting messages, focus the input:
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (status === 'awaiting_message') {
      inputRef.current?.focus();
    }
  }, [status]);

  return (
    <div className="flex flex-col pt-2 mx-auto stretch w-3/4 md:w-1/2 lg:w-2/5">
      {error != null && (
        <div className="relative bg-red-500 text-white px-6 py-4 rounded-md">
          <span className="block sm:inline">
            Error: {(error as any).toString()}
          </span>
        </div>
      )}

      <form onSubmit={submitMessage} className="w-full mb-4">
        <div className="relative w-full">
          <input
            ref={inputRef}
            disabled={status !== 'awaiting_message'}
            className="rounded-full w-full py-2 pl-4 pr-10 border border-gray-400 focus:outline-none focus:shadow-outline"
            value={input}
            placeholder="What is the temperature in the living room?"
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className={`cursor-pointer absolute right-0 top-0 rounded-r-full h-full text-black font-bold px-4 focus:outline-none focus:shadow-outline`}
          >
            <IoSend />
          </button>
        </div>
      </form>
      {messages.map((m: Message) => (
        <div
          key={m.id}
          className="whitespace-pre-wrap"
          style={{ color: roleToColorMap[m.role] }}
        >
          <strong>{`${m.role}: `}</strong>
          {m.role !== 'data' && m.content}
          {m.role === 'data' && (
            <>
              {(m.data as any).description}
              <br />
              <pre className={'bg-gray-200'}>
                {JSON.stringify(m.data, null, 2)}
              </pre>
            </>
          )}
          <br />
          <br />
        </div>
      ))}

      {status === 'in_progress' && (
        <div className="h-8 w-full max-w-md p-2 mb-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />
      )}
    </div>
  );
}
