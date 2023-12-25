'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { IoSend } from 'react-icons/io5';
import tw from 'tailwind-styled-components';

import { subscribeEmail } from '../actions';
import { Form } from './input-with-button';

export const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type="submit"
      className={` ${pending ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <IoSend className="h-6 w-6" />
    </Button>
  );
};

const Button = tw.button`
 focus:shadow-outline absolute 
 right-0 top-0 h-full cursor-pointer 
 rounded-r-full px-4 font-bold 
 text-black focus:outline-none
`;

const glowingShadowStyle = {
  boxShadow: `0 0 10px rgba(0, 0, 0, 0.3), 
                0 0 20px rgba(0, 0, 0, 0.2), 
                0 0 30px rgba(0, 0, 0, 0.1)`,
};

const glowingShadowHoverStyle = {
  boxShadow: `0 0 10px rgba(0, 0, 0, 0.4), 
              0 0 20px rgba(0, 0, 0, 0.3), 
              0 0 30px rgba(0, 0, 0, 0.2), 
              0 0 40px rgba(0, 0, 0, 0.1)`,
};

const MailchimpSubscribe = () => {
  const [outputState, functionAction] = useFormState(subscribeEmail, {
    status: '',
  });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {outputState.status === 'success' ? (
        <div className="text-center text-green-500">
          Thanks for subscribing! Join our{' '}
          <a
            className="font-medium text-blue-400"
            href="https://discord.gg/KfUxa8h3s6"
          >
            Discord
          </a>
        </div>
      ) : (
        <>
          <Form action={functionAction}>
            <div
              className="relative w-3/4"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Input
                style={isHovered ? glowingShadowHoverStyle : glowingShadowStyle}
                placeholder="Enter your email"
                type="email"
                name="email"
                required
              />
              <SubmitButton />
            </div>
          </Form>
          {outputState.status === 'error' && <div>error.title</div>}
        </>
      )}
    </>
  );
};

export default MailchimpSubscribe;

const Input = tw.input`
  focus:shadow-outline w-full rounded-full border 
  py-4 pl-4 pr-10 transition 
  duration-300 ease-in-out focus:outline-none
  text-xl
`;
