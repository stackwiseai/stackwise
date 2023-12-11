'use client';
import React, { useState } from 'react';
import { FaClipboard, FaCheckCircle } from 'react-icons/fa'; // Importing icons

interface ClipboardComponentProps {
  code: string;
  title?: any;
}

const ClipboardComponent: React.FC<ClipboardComponentProps> = ({
  code,
  title,
}) => {
  const [icon, setIcon] = useState(<FaClipboard className="text-gray-500" />); // Clipboard icon in black

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(code);
      console.log('Text copied to clipboard');
      setIcon(<FaCheckCircle className="text-gray-500" />);
      setTimeout(() => {
        setIcon(<FaClipboard className="text-gray-500" />);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <button onClick={handleClick} className="flex items-center cursor-pointer">
      <span className="text-sm text-gray-500 mt-1 mr-2">{title}</span>
      <div className="border-none bg-none">{icon}</div>
    </button>
  );
};

export default ClipboardComponent;
