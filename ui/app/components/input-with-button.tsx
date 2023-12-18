'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { IoSend } from 'react-icons/io5';
import tw from 'tailwind-styled-components';

// import SearchStacks from './search-stacks';
import { StackDescription } from '../stacks/stack-db';
import MailchimpSubscribe from './MailchimpSubscribe';

export const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className={`focus:shadow-outline absolute right-0 top-0 h-full cursor-pointer rounded-r-full px-4 font-bold text-black focus:outline-none ${
        pending ? 'cursor-not-allowed opacity-50' : ''
      }`}
    >
      <IoSend />
    </button>
  );
};

interface InputWithButtonProps {
  setBrief: React.Dispatch<React.SetStateAction<string>>;
  formAction: (payload: FormData) => void;
  stackDB: Record<string, StackDescription>;
}

const InputWithButton: React.FC<InputWithButtonProps> = ({
  setBrief,
  formAction,
  stackDB,
}) => {
  const router = useRouter();

  const handleSubmit = (e) => {
    const inputValue = e.target.elements.stack.value;
    setBrief(inputValue);
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
      {/* <SearchStacks /> */}
      <LuckyButton onClick={handleLuckyClick}>
        Take me to a random stack -{'>'}
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
  mt-3
  font-bold
  border-b
  transition
  duration-300
  ease-in-out
  transform
  hover:scale-110
  text-lg
`;

export default InputWithButton;
