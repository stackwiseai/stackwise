import tw from 'tailwind-styled-components';
import parse from 'html-react-parser';

interface InputsProps {
  formAction: (payload: FormData) => void;
  state: string;
}

const Inputs: React.FC<InputsProps> = ({ formAction, state }) => {
  return (
    <Form action={formAction}>
      {parse(state)}
      <button type="submit">Submit</button>
    </Form>
  );
};

export default Inputs;

const Form = tw.form`
  flex
  flex-col
  space-y-2
  w-1/2
`;
