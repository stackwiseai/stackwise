import tw from 'tailwind-styled-components';

interface InputsProps {
  state: any;
}

const Inputs: React.FC<InputsProps> = ({ state }) => {
  return <Outputs>{state}</Outputs>;
};

export default Inputs;

const Outputs = tw.form`
  w-1/2
  flex
  justify-center
  items-center
`;
