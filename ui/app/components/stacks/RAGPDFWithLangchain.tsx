// File path: ui/app/components/RAGPDFWithLangchain.tsx

import { useEffect, useMemo, useRef, useState } from 'react';

export const chatHistoryDelimiter = `||~||`;

type ChatHistoryProps = {
  chatHistory: string[];
  handleCancel: () => void;
};

const placeholderAnswering = 'A: Answering…'

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatHistory, handleCancel }) => (
  <div className="chat-history mt-4 p-4 border-t border-gray-200">
    {chatHistory.length > 0 && <h3 className="text-lg font-semibold">Chat History:</h3>}
    <ul className="mt-2">
      {chatHistory.map((entry, index) => (
        <li key={index} className={`mt-1 ${index % 2 !== 0 ? 'text-left' : 'text-right'}`}>
          <span className={`inline-block ${index % 2 !== 0 ? 'bg-blue-100' : 'bg-green-100'} rounded px-2 py-1`}>
            {entry}
            {entry === placeholderAnswering && (
              <button
                type="button"
                onClick={handleCancel}
                className="border rounded-md px-2 py-1 ml-2 bg-red-600 text-white font-bold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
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

const RAGPDFWithLangchain = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [pdfUploaded, setPdfUploaded] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const questionInputRef = useRef<HTMLInputElement>(null);
  const prevQuestionRef = useRef(question);

  useEffect(() => {
    return () => {
      // Clean up the fetch request if the component is unmounted during a request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    // Compare the previous question value with the current one
    if (prevQuestionRef.current && !question) {
      // The input has just been cleared
      handleClearQuestion();
    }
    // Update the ref to the current question for the next render
    prevQuestionRef.current = question;
  }, [question]); // Only re-run if question changes


  const handlePDFUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      setError('');
      setPdfFile(file);
      setPdfUploaded(true);
      setLoading(false);
      // Reset chat history and related states if chat history is not empty
      if (chatHistory.length > 0) {
        setChatHistory([]);
        setQuestion('');
      }
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Abort the fetch request
    }
    setLoading(false);
    setPdfFile(null);
    setPdfUploaded(false);
    setQuestion('');
    setError('');
  };

  const handleTotalReset = () => {
    // Reset all state to initial values
    handleCancel();
    setChatHistory([]);
    // Clear the file input if needed
    if (questionInputRef.current) {
      questionInputRef.current.value = '';
    }
    // Focus the file input after reset
    questionInputRef.current?.focus();
  };

  const handleClearQuestion = () => {
    // Clear the question input field
    setQuestion('');
    // Focus the question input after clearing
    questionInputRef.current?.focus();
  };

  const getChatHistoryString = () => {
    return chatHistory.join(chatHistoryDelimiter);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pdfFile || !question) {
      setError('Please upload a PDF and enter a question.');
      return;
    }
    setError('');
    setLoading(true);

    // Create a new AbortController and store its reference
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const formData = new FormData();
    formData.append('pdf', pdfFile);
    formData.append('question', question);
    formData.append('chatHistory', getChatHistoryString());

    // Temporarily add the question and "Answering..." message to the chat history
    setChatHistory((prev) => [...prev, `Q: ${question}`, placeholderAnswering]);

    try {
      const response = await fetch('/api/ragPDFWithLangchain', {
        method: 'POST',
        body: formData,
        signal: signal,
      });
      if (signal.aborted) return;

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        // Remove the temporary question and "Answering..." message if there's an error
        setChatHistory((prev) => prev.slice(0, -2));
      } else {
        // Replace the "Answering..." message with the actual answer
        setChatHistory((prev) => [...prev.slice(0, -1), `A: ${data.answer}`]);
      }
    } catch (error) {
      setError('An error occurred while fetching the data.');
      // Remove the temporary question and "Answering..." message if there's an error
      setChatHistory((prev) => prev.slice(0, -2));
    } finally {
      setLoading(false);
      setQuestion(''); // Clear the question input
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto flex flex-col h-full justify-between">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <div className="flex justify-end items-end align-middle gap-2">
          <label className="flex flex-col border rounded-lg p-1">
            <span id='pdfLabel'>PDF:</span>
              <input
                type="file"
                aria-labelledby="pdfLabel"
                accept="application/pdf"
                onChange={handlePDFUpload}
                disabled={loading}
                className="disabled:file:bg-gray-300 disabled:file:text-gray-500 mx-auto"
              />
          </label>
          <button
            type="button"
            disabled={!pdfUploaded && !question && !loading}
            onClick={handleTotalReset}
            className="border rounded-md h-full flex items-center disabled:bg-gray-100 disabled:text-gray-300 disabled:border-gray-200 background-color: #f5f5f5; px-2 py-1 pr-2 space-x-2 bg-red-600 text-white font-bold"
          >
            Reset
          </button>
        </div>
        <ChatHistory chatHistory={chatHistory} handleCancel={handleCancel} />
        <div className={`flex items-center gap-2 mb-4 ${!pdfUploaded ? 'hidden' : ''}`}>
          <input
            ref={questionInputRef}
            id="questionInput"
            type="search"
            value={question}
            disabled={loading}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What would you like to ask?"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500 flex-grow disabled:bg-gray-100 disabled:text-gray-300 disabled:border-gray-200"
          />
          <button
            type="submit"
            disabled={!pdfUploaded || !question || loading}
            className="border rounded-md px-4 py-2 bg-violet-600 text-white font-bold disabled:bg-violet-300"
          >
            Send
          </button>
        </div>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};


export default RAGPDFWithLangchain;