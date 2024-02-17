import tw from 'tailwind-styled-components';

import type { StackItem } from '../types';

interface ActionProps {
  actionInfo: StackItem;
  index: number;
}

const Action: React.FC<ActionProps> = ({ actionInfo, index }) => {
  return (
    <ActionContainer>
      <p>{actionInfo.type}</p>
      <p>{actionInfo.description}</p>
    </ActionContainer>
  );
};

export default Action;

const ActionContainer = tw.div`
    w-1/2
    p-4
    border
    border-gray-300
    bg-gray-50
    rounded
    mb-4
    flex
    flex-col
    items-center
    justify-center
`;
