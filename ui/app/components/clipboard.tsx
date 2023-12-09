'use client';
import React, { useState } from 'react';
import { FaClipboard, FaCheckCircle } from 'react-icons/fa'; // Importing icons

const ClipboardComponent = ({ path }) => {
  const [icon, setIcon] = useState(<FaClipboard style={{ color: 'black' }} />); // Clipboard icon in black

  const handleClick = async () => {
    try {
      const response = await fetch(path);
      const data = await response.text();

      await navigator.clipboard.writeText(data);
      console.log('Text copied to clipboard');
      setIcon(<FaCheckCircle style={{ color: 'black' }} />);
      setTimeout(() => {
        setIcon(<FaClipboard style={{ color: 'black' }} />);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{ border: 'none', background: 'none' }}
    >
      {icon}
    </button>
  );
};

export default ClipboardComponent;
