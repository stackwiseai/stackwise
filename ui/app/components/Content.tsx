'use client';
import { useState } from 'react';
import tw from 'tailwind-styled-components';
import InputWithButton from './InputWithButton';
import { parseFormData } from '../actions';
import { useFormState } from 'react-dom';
import { callStack } from '../actions';

import Inputs from './Inputs';
import Outputs from './Outputs';

const Content: React.FC = () => {
  const [outputState, functionAction] = useFormState(parseFormData, null);
  const [stackIO, createStack] = useFormState(callStack, {
    input: '',
    output: '',
  });
  const [brief, setBrief] = useState<string>('');

  console.log('outputState, stackIO', outputState, stackIO);

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
