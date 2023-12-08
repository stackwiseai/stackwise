'use client';

import tw from 'tailwind-styled-components';
import { parseFormData } from '../actions';
import { useFormState } from 'react-dom';

import Inputs from './Inputs';
import Outputs from './Outputs';

const FunctionIO: React.FC = () => {
  const [state, formAction] = useFormState(parseFormData, 0);
  return (
    <Container>
      <Inputs formAction={formAction} />
      <Outputs state={state} />
    </Container>
  );
};

export default FunctionIO;

const Container = tw.div`
  flex
  justify-center
  items-center
  w-2/3
  space-x-6
`;
