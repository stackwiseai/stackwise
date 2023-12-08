'use client';
import { useState } from 'react';
import tw from 'tailwind-styled-components';
import InputWithButton from './InputWithButton';
import FunctionIO from './FunctionIO';

const Content: React.FC = () => {
  const [brief, setBrief] = useState<string>('');

  return (
    <>
      <InputWithButton setBrief={setBrief} />
      <Brief>"{brief}"</Brief>
      <FunctionIO />
    </>
  );
};

const Brief = tw.div`
    font-bold
    text-lg
    mb-2
`;

export default Content;
