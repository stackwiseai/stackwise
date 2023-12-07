import React, { useState } from 'react';
import { FaGithub } from 'react-icons/fa'; // Import the GitHub icon
const LoadingComponent = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div
        style={{
          border: '16px solid #f3f3f3' /* Light grey */,
          borderTop: '16px solid #3498db' /* Blue */,
          borderRadius: '50%',
          width: '120px',
          height: '120px',
          animation: 'spin 2s linear infinite',
        }}
      />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

// Chat component
export const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [generatedFileContents, setGeneratedFileContents] = useState('');
  const [loading, setLoading] = useState(false);
  const [stackResponse, setStackResponse] = useState(''); // State to hold stack response
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const postGeneratedFileContents = async (fileContent) => {
    try {
      const response = await fetch('/api/stack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileContent }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json(); // Assuming the response is JSON
      setStackResponse(JSON.stringify(responseData)); // Update state with stack response
    } catch (error) {
      console.error('Error in POST /api/stack:', error);
      setStackResponse(`Error: ${error.message}`); // Handle error in stack response
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Submitting:', inputValue);
    if (inputValue.trim()) {
      setGeneratedFileContents('');
      setLoading(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ brief: inputValue }),
        });
        const data = await response.body;

        if (!data) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let fullContent = '';

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value, { stream: !done });
          setGeneratedFileContents((prev) => prev + chunkValue);
          fullContent += chunkValue;
        }

        postGeneratedFileContents(fullContent);
      } catch (error) {
        console.error('Error during fetch:', error);
      } finally {
        setInputValue(''); // Clear the input field
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type here..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit(e);
          }}
        />
        <button type="submit" disabled={loading}>
          Submit
        </button>
        {loading && <span>GO take a coffee</span> && LoadingComponent()}
      </form>
      <div>
        {stackResponse && (
          <div>
            <a
              href="https://stackwise-git-a32f3e19-8204-46c4-b664-8a1642d20c6f-stackwiseai.vercel.app"
              style={{ color: 'blue', textDecoration: 'none' }}
            >
              Check your new app!
            </a>
            <br />
            <a
              href="https://github.com/stackwiseai/stackwise/compare/main...a32f3e19-8204-46c4-b664-8a1642d20c6f"
              style={{ color: 'blue', textDecoration: 'none' }}
            >
              Check your new commit!
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
