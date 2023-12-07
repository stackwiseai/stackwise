'use client';
import { useState } from 'react';
import tw from 'tailwind-styled-components';
import { callStack } from '../actions';

const InputWithButton: React.FC = () => {
  return (
    <form action={callStack}>
      <Input placeholder="Enter something..." type="text" name="stack" />
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
