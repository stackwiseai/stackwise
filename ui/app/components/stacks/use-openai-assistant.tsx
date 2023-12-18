'use client';

import { useEffect, useRef } from 'react';
import { Message, experimental_useAssistant as useAssistant } from 'ai/react';
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
    <div className="stretch mx-auto flex w-3/4 flex-col pt-2 md:w-1/2 lg:w-2/5">
      {error != null && (
        <div className="relative rounded-md bg-red-500 px-6 py-4 text-white">
          <span className="block sm:inline">
            Error: {(error as any).toString()}
          </span>
        </div>
      )}

      <form onSubmit={submitMessage} className="mb-4 w-full">
        <div className="relative w-full">
          <input
            ref={inputRef}
            disabled={status !== 'awaiting_message'}
            className="focus:shadow-outline w-full rounded-full border border-gray-400 py-2 pl-4 pr-10 focus:outline-none"
            value={input}
            placeholder="What is the temperature in the living room?"
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className={`focus:shadow-outline absolute right-0 top-0 h-full cursor-pointer rounded-r-full px-4 font-bold text-black focus:outline-none`}
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
        <div className="mb-8 h-8 w-full max-w-md animate-pulse rounded-lg bg-gray-300 p-2 dark:bg-gray-600" />
      )}
    </div>
  );
}
