'use client';

import React, { useState } from 'react';
import { FaCheckCircle, FaClipboard } from 'react-icons/fa'; // Importing icons

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
    <button
      onClick={handleClick}
      className="mt-2 flex cursor-pointer items-center sm:mt-0"
    >
      <span className="mr-2 text-sm text-gray-500">{title}</span>
      <div className="-mt-0.5 border-none bg-none">{icon}</div>
    </button>
  );
};

export default ClipboardComponent;
