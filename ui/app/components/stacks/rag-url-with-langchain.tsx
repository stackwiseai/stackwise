'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Message } from 'ai/react';
import { useChat } from 'ai/react';
import DOMPurify from 'dompurify';
import { IoSend } from 'react-icons/io5';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import React from 'react';

export enum CrawlMethod {
  FETCH = 'FETCH',
  EDGE_BROWSER = 'EDGE_BROWSER',
  PUPPETEER = 'PUPPETEER',
  // APIFY = 'APIFY',
}

export enum ModelType {
  GPT3Turbo = 'gpt-3.5-turbo',
  GPT3Turbo16k = 'gpt-3.5-turbo-16k',
  GPT4 = 'gpt-4',
  GPT4Turbo = 'gpt-4-1106-preview',
  GeminiPro = 'gemini-pro',
}

type SourcesForMessages = Record<string, string[]>;

interface URLDetecting {
  inputText: string;
  setInputText: (inputText: string) => void;
  sendMessage: () => void;
}

const dummyEvent: React.FormEvent<HTMLFormElement> = {
  ...(new Event('submit') as any), // Cast to 'any' to allow assignment to FormEvent
  currentTarget: {
    ...document.createElement('form'),
    checkValidity: () => true, // Assuming the form is valid
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  preventDefault: () => {}, // No-op function
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  stopPropagation: () => {}, // No-op function
  target: document.createElement('form'),
} as React.FormEvent<HTMLFormElement>;

interface URLDetectingInputProps extends URLDetecting {
  placeholder?: string;
}

// Regular expression to match URL-like patterns including path and query
const urlPattern = /(?:https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(\/\S*)?/gi;

function useURLDetector(urlDetectingContext: URLDetecting): string[] {
  const { inputText } = urlDetectingContext;

  const detectedURLs = useMemo(() => {
    return (inputText.match(urlPattern) ?? []) as string[];
  }, [inputText]);

  return detectedURLs;
}

const URLDetectingInput = ({
  placeholder,
  ...useDetector
}: URLDetectingInputProps) => {
  const { inputText, setInputText, sendMessage } = useDetector;
  const contentEditableRef = useRef<HTMLDivElement | null>(null);
  const isComposing = useRef(false);

  const handleInput = useCallback(
    (event) => {
      if (!isComposing.current) {
        const text = event.currentTarget?.textContent ?? '';
        setInputText(text);
      }
    },
    [setInputText],
  );

  const handleComposition = useCallback(
    (event) => {
      if (event.type === 'compositionend') {
        isComposing.current = false;
        setInputText(event.currentTarget.textContent ?? '');
      } else {
        isComposing.current = true;
      }
    },
    [setInputText],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default Enter key behavior
        // Call the sendMessage function here
        // You need to pass this function down from the parent component
        sendMessage();
      }
    },
    [sendMessage],
  );

  useEffect(() => {
    if (!contentEditableRef.current) return;
    contentEditableRef.current.style.whiteSpace = 'pre-wrap';

    // Sanitize the inputText before setting it as innerHTML
    const sanitizedInputText = DOMPurify.sanitize(
      inputText.replace(
        urlPattern,
        (match) => `<strong><u>${match}</u></strong>`,
      ),
    );

    contentEditableRef.current.innerHTML = sanitizedInputText;
  }, [inputText]);

  useEffect(() => {
    const moveCursorToEnd = () => {
      const range = document.createRange();
      const selection = window.getSelection();

      if (!contentEditableRef.current) return;
      if (!selection) return;

      range.setStart(
        contentEditableRef.current,
        contentEditableRef.current.childNodes.length,
      );

      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    };
    moveCursorToEnd();
  }, [contentEditableRef.current?.textContent, inputText]);

  return (
    <div className="relative">
      {/* for production applications, more care should be taken to support native affordances like undo, a11y, and also care should be taken to prevent XSS*/}
      <div
        ref={contentEditableRef}
        contentEditable
        onInput={handleInput}
        onCompositionStart={handleComposition}
        onCompositionEnd={handleComposition}
        onKeyDown={handleKeyDown}
        className={`content-editable rounded border border-gray-400 p-2 ${
          !inputText ? 'placeholder' : ''
        }`}
        suppressContentEditableWarning={true}
        role="textbox"
        tabIndex={0}
      ></div>
      {/* Render the placeholder text when inputText is empty and the div is not focused */}
      {!inputText && (
        <div className="pointer-events-none absolute left-0 top-0 p-2.5 text-gray-400">
          {placeholder}
        </div>
      )}
    </div>
  );
};

export function ChatMessageBubble(props: {
  message: Message;
  aiEmoji?: string;
  sources: any[];
}) {
  const colorClassName =
    props.message.role === 'user' ? 'bg-sky-600' : 'bg-slate-50 text-black';
  const alignmentClassName =
    props.message.role === 'user' ? 'ml-auto' : 'mr-auto';
  const prefix = props.message.role === 'user' ? '🧑' : props.aiEmoji;
  return (
    <div
      className={`${alignmentClassName} ${colorClassName} mb-8 flex max-w-[80%] rounded px-4 py-2`}
    >
      <div className="mr-2">{prefix}</div>
      <div className="flex flex-col whitespace-pre-wrap">
        <span>{props.message.content}</span>
        {props.sources && props.sources.length ? (
          <>
            <code className="mr-auto mt-4 rounded bg-slate-600 px-2 py-1">
              <h2>🔍 Sources:</h2>
            </code>
            <code className="mr-2 mt-1 rounded bg-slate-600 px-2 py-1 text-xs">
              {props.sources?.map((source, i) => (
                <div className="mt-2" key={'source:' + i}>
                  {i + 1}. &quot;{source.pageContent}&quot;
                  {source.metadata?.loc?.lines !== undefined ? (
                    <div>
                      <br />
                      Lines {source.metadata?.loc?.lines?.from} to{' '}
                      {source.metadata?.loc?.lines?.to}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              ))}
            </code>
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

const RAGURLWithLangchain = () => {
  const [sourcesForMessages, setSourcesForMessages] =
    useState<SourcesForMessages>({});
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedCrawlMethod, setSelectedCrawlMethod] = useState<CrawlMethod>(
    CrawlMethod.PUPPETEER,
  );
  const [selectedModelType, setSelectedModelType] = useState<ModelType>(
    ModelType.GPT3Turbo,
  );

  const {
    messages,
    input,
    error,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    api: '/api/rag-url-with-langchain',
    onResponse(response) {
      console.log('onResponse', response);
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
    onFinish(message: Message) {
      console.log('onFinish', message);
    },
    onError: (e) => {
      toast(e.message);
    },
    sendExtraMessageFields: true,
  });

  const handleInputChangeWithUrlDetection = useCallback(
    (event) => {
      handleInputChange(event);
      setInput(event.target.value);
    },
    [handleInputChange, setInput],
  );

  const detectedURLs = useURLDetector({
    inputText:
      messages.filter((m) => m.role !== 'assistant').join('\n') + input,
    setInputText: handleInputChangeWithUrlDetection,
    sendMessage: () => void sendMessage(),
  });

  const sendMessage = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (messageContainerRef.current) {
      messageContainerRef.current.classList.add('grow');
    }
    if (!messages.length) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    if (isLoading) {
      return;
    }

    const body = {
      urls: detectedURLs,
      chat: input,
      crawlMethod: selectedCrawlMethod,
      modelName: selectedModelType,
      returnIntermediateSteps: true, // currently does nothing on the backend
    };
    handleSubmit(event ?? dummyEvent, {
      options: { body },
    });
  };

  useEffect(() => {
    toast(error?.message);
  }, [error]);

  return (
    <div
      className={`flex w-full grow flex-col items-center overflow-hidden rounded ${
        messages.length > 0 ? 'border' : ''
      }`}
    >
      {messages.length === 0 ? <></> : ''}
      <div
        className="flex w-full flex-col-reverse overflow-auto transition-[flex-grow] ease-in-out"
        ref={messageContainerRef}
      >
        {messages.length > 0
          ? [...messages].reverse().map((m, i) => {
              const sourceKey = (messages.length - 1 - i).toString();
              return (
                <ChatMessageBubble
                  key={m.id}
                  message={m}
                  aiEmoji={'🤖'}
                  sources={sourcesForMessages[sourceKey]}
                ></ChatMessageBubble>
              );
            })
          : ''}
      </div>
      <form onSubmit={sendMessage} className="w-full max-w-xl p-4">
        <div className={`relative mb-4 w-full`}>
          <URLDetectingInput
            placeholder="Include URLs as context along with your prompt"
            inputText={input}
            setInputText={setInput}
            sendMessage={sendMessage}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`focus:shadow-outline absolute right-0 top-0 h-full cursor-pointer rounded-r-full px-4 font-bold text-black focus:outline-none  ${
              isLoading ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            <IoSend />
          </button>
        </div>
        <div className="mb-4 flex w-full max-w-xl justify-between">
          <label
            htmlFor="crawlMethodSelector"
            className="block text-sm font-medium text-gray-700"
          >
            URL Crawl Method
            <select
              id="crawlMethodSelector"
              value={selectedCrawlMethod}
              onChange={(e) =>
                setSelectedCrawlMethod(e.target.value as CrawlMethod)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {Object.values(CrawlMethod).map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </label>
          <label
            htmlFor="modelTypeSelector"
            className="block text-sm font-medium text-gray-700"
          >
            Model Type
            <select
              id="modelTypeSelector"
              value={selectedModelType}
              onChange={(e) =>
                setSelectedModelType(e.target.value as ModelType)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {Object.values(ModelType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>
      </form>
    </div>
  );
};

export default RAGURLWithLangchain;
