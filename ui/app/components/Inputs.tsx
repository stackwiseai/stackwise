import tw from 'tailwind-styled-components';

interface InputsProps {
  formAction: (payload: FormData) => void;
}

const Inputs: React.FC<InputsProps> = ({ formAction }) => {
  return (
    <Form action={formAction}>
      <input type="number" name="num1" placeholder="Enter num1" required />
      <input type="number" name="num2" placeholder="Enter num2" required />
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
