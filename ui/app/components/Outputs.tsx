import tw from 'tailwind-styled-components';
import parse from 'html-react-parser';

interface InputsProps {
  state: string;
  value: any;
}

const Inputs: React.FC<InputsProps> = ({ state, value }) => {
  const renderContent = () => {
    // Split the string by your placeholder pattern
    const parts = state.split(/({[^}]+})/).filter(Boolean);

    return parts.map((part, index) => {
      if (part.startsWith('{') && part.endsWith('}')) {
        // Extract and evaluate the expression
        const expression = part.slice(1, -1);

        // Check if the expression is trying to access a property of 'value'
        if (expression.startsWith('value.')) {
          const property = expression.slice(6);

          // Check if 'value' is an object and the property is not null/undefined
          if (value && typeof value === 'object' && value[property] != null) {
            return value[property].toString();
          }
          return ''; // Return an empty string if the property is null/undefined
        }

        // Handle the direct 'value' expression
        if (expression === 'value') {
          return value != null ? value.toString() : '';
        }

        return ''; // If the expression cannot be evaluated, return an empty string
      } else {
        // If part is not an expression, return it as is
        return part;
      }
    });
  };

  return (
    <Outputs>
      <div dangerouslySetInnerHTML={{ __html: renderContent().join('') }} />
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
