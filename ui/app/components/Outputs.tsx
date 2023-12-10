import tw from 'tailwind-styled-components';
import parse from 'html-react-parser';

interface InputsProps {
  state: string;
  values: any;
}

const Inputs: React.FC<InputsProps> = ({ state, values }) => {
  return (
    <Outputs>
      <div>{parse(state)}</div>
    </Outputs>
  );
};

export default Inputs;

const Outputs = tw.form`
  w-1/2
  flex
  justify-center
  items-center
`;
