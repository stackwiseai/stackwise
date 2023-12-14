'use client';
import { useState, useEffect, useRef } from 'react';
import tw from 'tailwind-styled-components';
import { IoSend } from 'react-icons/io5';
import { stackDB } from '../stacks/stack-db';
import { useRouter } from 'next/navigation';

import { useFormStatus } from 'react-dom';
import MailchimpSubscribe from './MailchimpSubscribe';
import SearchStacks from './search-stacks';

export const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className={`cursor-pointer absolute right-0 top-0 rounded-r-full h-full text-black font-bold px-4 focus:outline-none focus:shadow-outline ${
        pending ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <IoSend />
    </button>
  );
};

interface InputWithButtonProps {
  setBrief: React.Dispatch<React.SetStateAction<string>>;
  formAction: (payload: FormData) => void;
}

const InputWithButton: React.FC<InputWithButtonProps> = ({
  setBrief,
  formAction,
}) => {
  const router = useRouter();

  const handleSubmit = (e) => {
    const inputValue = e.target.elements.stack.value;
    setBrief(inputValue);
  };

  const rainbowText = {
    background:
      'linear-gradient(45deg, gray, red, orange, yellow, green, blue, indigo, violet)',
    color: 'transparent',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const handleLuckyClick = () => {
    const randomEntry =
      Object.keys(stackDB)[
        Math.floor(Math.random() * Object.keys(stackDB).length)
      ];
    router.push(`/stacks/${randomEntry}`);
  };

  return (
    <FormWrapper>
      {/* <Form onSubmit={handleSubmit} action={formAction}>
        <div className="relative w-full sm:w-3/4">
          <input
            placeholder="I want an api that..."
            type="text"
            name="stack"
            className="rounded-full w-full py-2 pl-4 pr-10 border border-gray-400 focus:outline-none focus:shadow-outline"
            required
          />
          <SubmitButton />
        </div>
      </Form> */}
      {/* <MailchimpSubscribe /> */}
      <SearchStacks />
      <LuckyButton onClick={handleLuckyClick} style={rainbowText}>
        bored button
      </LuckyButton>
    </FormWrapper>
  );
};
const FormWrapper = tw.div`
  md:w-3/4
  w-full
  flex
  flex-col
  items-center
`;

export const Form = tw.form`
  flex
  items-center
  justify-center
  lg:w-1/2
  md:w-3/4
  w-full
  mb-2
`;

const LuckyButton = tw.button`
  bg-gradient-to-r
  from-gray-400
  to-[#FF0000]
  hover:from-gray-500
  hover:to-[#FF7F00]
  text-white
  font-bold
  py-3
  px-6
  rounded
  transition
  duration-300
  ease-in-out
  transform
  hover:scale-110
  text-lg
`;

export default InputWithButton;
