// page.tsx
import React, { useState } from 'react';
import Home from './Home'; // Adjust the path to where your Home.tsx is located

// Chat component
export const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [apiKey, setApiKey] = useState('Your-Default-API-Key'); // Replace with your actual default API key

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Submitting:', inputValue);
    if (inputValue.trim()) {
      try {
        const response = await fetch('/api/stack', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}` // Include the API key in the Authorization header
          },
          body: JSON.stringify({ brief: inputValue })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response:', data); // Process the response as needed
      } catch (error) {
        console.error('Error during fetch:', error);
      }

      setInputValue(''); // Clear the input field
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type here..."
        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e); }}
      />
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter API Key"
        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e); }}
      />
    </form>
  );
};
