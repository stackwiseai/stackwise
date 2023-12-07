'use client';
import { callStack } from '../actions';

import { useFormState } from 'react-dom';

const InputWithButton: React.FC = () => {
  const [state, formAction] = useFormState(callStack, { message: null });
  return (
    <form action={formAction}>
      <input
        placeholder="Enter something..."
        type="text"
        name="stack"
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};
