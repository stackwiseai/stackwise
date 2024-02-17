'use client';

import { useState } from 'react';
import tw from 'tailwind-styled-components';

const Builder: React.FC = () => {
  const [input, setInput] = useState<string>(
    'Using GPT, summarize all of my Git commits in the last month',
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    // This is where the API call would go

    setLoading(false);
  };

  return (
    <BuilderWrapper>
      <BuilderInput value={input} onChange={(e) => setInput(e.target.value)} />
      <Button
        onClick={handleSubmit}
        type="submit"
        disabled={loading}
        className={`${loading && 'bg-black text-white'}`}
      >
        Submit
      </Button>
    </BuilderWrapper>
  );
};

export default Builder;

const BuilderWrapper = tw.div`
 flex 
 w-full
 flex-col
 items-center
 justify-center
`;

const BuilderInput = tw.textarea`
    w-1/2
    p-2
    mb-2
    border
    border-gray-300
    bg-gray-50
    rounded
    resize-none
    focus:outline-none
    h-24
`;

const Button = tw.button`
  rounded-md border border-black px-3 py-1 font-medium
`;
