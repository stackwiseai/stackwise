'use client';
import { useState } from 'react';
import tw from 'tailwind-styled-components';
import { callStack } from '../actions';

import { useFormState, useFormStatus } from 'react-dom';

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      Submit
    </Button>
  );
};

const InputWithButton: React.FC = () => {
  const [state, formAction] = useFormState(callStack, { message: null });
  return (
    <>
      <form action={formAction}>
        <Input
          placeholder="Enter something..."
          type="text"
          name="stack"
          required
        />
        <SubmitButton />
      </form>
      <p>{JSON.stringify(state.message)}</p>
    </>
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
  disabled:bg-slate-500
`;

export default InputWithButton;
