'use client';
import tw from 'tailwind-styled-components';
import { IoSend } from 'react-icons/io5';

import { useFormStatus } from 'react-dom';

const SubmitButton = () => {
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

  return (
    <FormWrapper>
      <Form onSubmit={handleSubmit} action={formAction}>
        <div className="relative w-1/2">
          <input
            placeholder="Enter something..."
            type="text"
            name="stack"
            className="rounded-full w-full py-2 pl-4 pr-10 border border-gray-400 focus:outline-none focus:shadow-outline"
            required
          />
          <SubmitButton />
        </div>
      </Form>
      <LuckyButton style={rainbowText}>i'm feeling lucky</LuckyButton>
    </FormWrapper>
  );
};
const FormWrapper = tw.div`
  w-1/2
  flex
  flex-col
  items-center
`;

const Form = tw.form`
  flex
  items-center
  justify-center
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
  
`;

export default InputWithButton;
