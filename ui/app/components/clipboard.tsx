'use client';
import React, { useEffect, useState } from 'react';

// Define a component
const ClipboardComponent = ({ displayMessage, path }) => {
  const [fileContent, setFileContent] = useState('');

  const handleClick = async () => {
    try {
      fetch(path)
        .then((response) => response.text())
        .then((data) => {
          setFileContent(data);
        })
        .catch((error) => {
          console.error('Error fetching the file:', error);
        });
      await navigator.clipboard.writeText(fileContent);
      console.log('Text copied to clipboard');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return <button onClick={handleClick}>{displayMessage}</button>;
};

export default ClipboardComponent;
