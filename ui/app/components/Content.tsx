'use client';
import { useState } from 'react';
import tw from 'tailwind-styled-components';
import InputWithButton from './InputWithButton';
import { parseFormData } from '../actions';
import { useFormState } from 'react-dom';

import Inputs from './Inputs';
import Outputs from './Outputs';

const Content: React.FC = () => {
  const [state, formAction] = useFormState(parseFormData, 0);
  const [brief, setBrief] = useState<string>('');

  return (
    <>
      <InputWithButton setBrief={setBrief} />
      <Brief>{brief ? `"${brief}"` : ''}</Brief>
      <Container>
        <Inputs formAction={formAction} />
        <Outputs state={state} />
      </Container>
    </>
  );
};

const Brief = tw.div`
    font-bold
    text-lg
    mb-2
    h-8
`;

const Container = tw.div`
  flex
  justify-center
  items-center
  w-2/3
  space-x-6
`;

export default Content;
