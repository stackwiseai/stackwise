'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Message } from 'ai/react';
import { useChat } from 'ai/react';
import type { AgentStep } from 'langchain/schema';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

interface ChatHistoryProps {
  chatHistory: Message[];
  handleCancel: () => void;
}
type SourcesForMessages = Record<string, string[]>;

const placeholderAnswering = 'A: Answering…';

const ensureHttpProtocol = (urlString: string) => {
  if (!/^(?:f|ht)tps?\:\/\//.test(urlString)) {
    return `https://${urlString}`;
  }
  return urlString;
};

const isValidUrl = (urlString: string) => {
  const urlPattern =
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
  const prefixedUrlString = ensureHttpProtocol(urlString);
  return urlPattern.test(prefixedUrlString);
};

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chatHistory,
  handleCancel,
}) => (
  <div
    className={`mt-4 p-4 ${
      chatHistory.length > 0 && 'border-t'
    } border-gray-200`}
  >
    <ul className="mt-2">
      {chatHistory.map((entry, index) => (
        <li
          key={index}
          className={`mt-1 ${index % 2 !== 0 ? 'text-left' : 'text-right'}`}
        >
          <span
            className={`inline-block ${
              index % 2 !== 0 ? 'bg-blue-100' : 'bg-green-100'
            } rounded px-2 py-1`}
          >
            {entry.content}
            {entry.content === placeholderAnswering && (
              <button
                type="button"
                onClick={handleCancel}
                className="ml-2 rounded-md border bg-red-600 px-2 py-1 text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Stop
              </button>
            )}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

const RAGURLWithLangchain = () => {
  const [sourcesForMessages, setSourcesForMessages] =
    useState<SourcesForMessages>({});
  const [inputUrl, setInputUrl] = useState<string>(
    'https://www.waggledance.ai',
  );
  const [showIntermediateSteps, setShowIntermediateSteps] = useState(false);
  const [intermediateStepsLoading, setIntermediateStepsLoading] =
    useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputUrlRef = useRef<HTMLInputElement | null>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const hasValidUrl = useMemo(() => isValidUrl(inputUrl), [inputUrl]);

  const chatHistory = useMemo(() => {
    return Object.entries(sourcesForMessages).map(
      ([index, sources]) =>
        ({
          id: index,
          content: sources.join(' '),
          role: Number.parseInt(index) % 2 === 0 ? 'user' : 'assistant',
        }) as Message,
    );
  }, [sourcesForMessages]);

  const {
    messages,
    input,
    error,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    api: '/api/rag-url-with-langchain',
    onResponse(response) {
      const sourcesHeader = response.headers.get('x-sources');
      const sources = sourcesHeader ? JSON.parse(atob(sourcesHeader)) : [];
      const messageIndexHeader = response.headers.get('x-message-index');
      if (sources.length && messageIndexHeader !== null) {
        setSourcesForMessages({
          ...sourcesForMessages,
          [messageIndexHeader]: sources,
        });
      }
    },
    onError: (e) => {
      toast(e.message, {
        theme: 'dark',
      });
    },
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasValidUrl) {
      toast('Please enter a valid URL.');
      return;
    }
    if (messageContainerRef.current) {
      messageContainerRef.current.classList.add('grow');
    }
    if (!messages.length) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    if (isLoading ?? intermediateStepsLoading) {
      return;
    }

    if (!showIntermediateSteps) {
      handleSubmit(event);
    } else {
      setIntermediateStepsLoading(true);
      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch('/api/rag-url-with-langchain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: inputUrl, chat: input }),
          signal: abortControllerRef.current.signal,
        });

        if (response.status === 200) {
          const json = await response.json();
          if (showIntermediateSteps) {
            const intermediateStepMessages = (
              json.intermediate_steps ?? []
            ).map((intermediateStep: AgentStep, i: number) => ({
              id: (chatHistory.length + i).toString(),
              content: JSON.stringify(intermediateStep),
              role: 'system',
            }));
            setMessages([...messages, ...intermediateStepMessages]);
          } else {
            setMessages([
              ...messages,
              {
                id: Date.now().toString(),
                content: json.answer,
                role: 'assistant',
              },
            ]);
          }
        } else {
          toast('An error occurred while fetching data.');
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast('An error occurred while sending the message.');
        }
      } finally {
        setIntermediateStepsLoading(false);
        abortControllerRef.current = null;
      }
    }
  };

  return (
    <div className="mx-auto flex h-full w-full flex-col items-center justify-between p-4">
      <form onSubmit={sendMessage} className="w-full max-w-xl p-4">
        <input
          ref={inputUrlRef}
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Enter URL"
          className="w-full rounded border p-2"
        />
        <input
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          placeholder="Enter your message"
          className="mt-2 w-full rounded border p-2"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim() || !hasValidUrl}
          className="mt-2 w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isLoading ? 'Loading...' : 'Send'}
        </button>
      </form>
      <ChatHistory
        chatHistory={chatHistory}
        handleCancel={() => abortControllerRef.current?.abort()}
      />
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
};

export default RAGURLWithLangchain;
