'use client';
import { useState } from 'react';
import tw from 'tailwind-styled-components';
import InputWithButton from './input-with-button';
import { parseFormData } from '../actions';
import { useFormState } from 'react-dom';
import { callStack } from '../actions';

import Inputs from './Inputs';
import Outputs from './outputs';

const Content: React.FC = () => {
  const [outputState, functionAction] = useFormState(parseFormData, null);
  const [stackIO, createStack] = useFormState(callStack, {
    input: '',
    output: '',
  });
  const [brief, setBrief] = useState<string>('');

  return (
    <>
      <InputWithButton setBrief={setBrief} formAction={createStack} />
      <Brief>{brief ? `"${brief}"` : ''}</Brief>
      <Container>
        {stackIO.input && (
          <>
            <Inputs
              state={stackIO.input ? stackIO.input : 'No input'}
              formAction={functionAction}
            />
            <Outputs
              state={stackIO.output ? stackIO.output : 'No output'}
              value={outputState}
            />
          </>
        )}
      </Container>
      {stackIO.input && <DeployButton>Deploy</DeployButton>}
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

const DeployButton = tw.button`
  text-white
  bg-black
  font-bold
  py-3
  px-6
  rounded
  mt-4
`;

export default Content;
