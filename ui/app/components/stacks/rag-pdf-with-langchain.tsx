// File path: ui/app/components/RAGPDFWithLangchain.tsx

import { useEffect, useMemo, useRef, useState } from 'react';
import { IoSend } from 'react-icons/io5';

const chatHistoryDelimiter = `||~||`;

type ChatHistoryProps = {
  chatHistory: string[];
  handleCancel: () => void;
};

const placeholderAnswering = 'A: Answering…'

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatHistory, handleCancel }) => (
  <div className="chat-history mt-4 p-4 border-t border-gray-200">
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
  const pdfRef = useRef<HTMLInputElement>(null);

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
    pdfRef.current.value = null
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
      const response = await fetch('/api/rag-pdf-with-langchain', {
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
          <label className="flex flex-col rounded-lg p-1">
            <input
              ref={pdfRef}
              type="file"
              aria-label='Upload PDF'
              accept="application/pdf"
              onChange={handlePDFUpload}
              disabled={loading}
              className="w-full md:w-auto py-1 mr-2 cursor-pointer border-dashed border-2 rounded-md file:border-0 file:bg-transparent file:text-sm file:font-semibold"
            />
          </label>
          <button
            type="button"
            disabled={!pdfUploaded && !question && !loading}
            onClick={handleTotalReset}
            className="border rounded-md mb-1.5 flex items-center disabled:bg-gray-100 disabled:text-gray-300 disabled:border-gray-200 background-color: #f5f5f5; px-2 py-1 pr-2 space-x-2 bg-red-600 text-white font-bold"
          >
            Reset
          </button>
        </div>
        <ChatHistory chatHistory={chatHistory} handleCancel={handleCancel} />
        <div className={`relative w-full mb-4 ${!pdfUploaded ? 'hidden' : ''}`}>
          <input
            ref={questionInputRef}
            id="questionInput"
            type="search"
            value={question}
            disabled={loading}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What would you like to ask?"
            className="rounded-full w-full py-2 pl-4 pr-10 border border-gray-400 focus:outline-none focus:shadow-outline"
          />
          <button
            type="submit"
            disabled={!pdfUploaded || !question || loading}
            className={`cursor-pointer absolute right-0 top-0 rounded-r-full h-full text-black font-bold px-4 focus:outline-none focus:shadow-outline ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <IoSend />
          </button>
        </div>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default RAGPDFWithLangchain;