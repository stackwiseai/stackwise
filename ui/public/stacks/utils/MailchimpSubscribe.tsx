'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { IoSend } from 'react-icons/io5';
import tw from 'tailwind-styled-components';

import { Form } from '../v1/creation/input-with-button';
import { subscribeEmail } from './actions';

const glowingShadowStyle = {
  boxShadow: `0 0 10px rgba(0, 0, 0, 0.1), 
                0 0 20px rgba(0, 0, 0, 0.05)`,
};

const MailchimpSubscribe = () => {
  const [outputState, functionAction] = useFormState(subscribeEmail, {
    status: '',
  });
  const { pending } = useFormStatus();

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
            <div className="relative w-full">
              <Input
                style={glowingShadowStyle}
                placeholder="Enter your email"
                type="email"
                name="email"
                required
              />
              <Button
                disabled={pending}
                type="submit"
                className={` ${pending ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <IoSend className="h-5 w-5" />
              </Button>
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
  w-full rounded-full border 
  py-2 pl-4 pr-10 transition 
  duration-300 ease-in-out
  text-lg
  focus:outline-none
`;

const Button = tw.button`
 focus:shadow-outline absolute 
 right-0 top-0 h-full cursor-pointer 
 rounded-r-full px-4 font-bold 
 text-black focus:outline-none
`;
