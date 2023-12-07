'use client';
import { useState } from 'react';
import tw from 'tailwind-styled-components';

const InputWithButton: React.FC = ({}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submit action
    console.log('Input value:', inputValue);
    // Additional logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter something..."
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

const Input = tw.input`
  rounded-md
  p-3
  border
  border-gray-300
  focus:outline-none
  focus:border-blue-500
  transition
  duration-200
  w-[500px]
  mr-4
`;

const Button = tw.button`
  bg-blue-500
  hover:bg-blue-700
  text-white
  font-bold
  py-3
  px-4
  rounded
`;

export default InputWithButton;
