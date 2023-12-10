'use client';
import tw from 'tailwind-styled-components';

import { useFormStatus } from 'react-dom';

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      Submit
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
        <input
          className="mr-4"
          placeholder="Enter something..."
          type="text"
          name="stack"
          required
        />
        <SubmitButton />
      </Form>
      <LuckyButton style={rainbowText}>i'm feeling lucky</LuckyButton>
    </FormWrapper>
  );
};
const FormWrapper = tw.div`
  w-1/2
  mb-32
  flex
  flex-col
  items-center
`;

const Form = tw.form`
  flex
  items-center
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
