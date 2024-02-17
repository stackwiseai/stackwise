'use client';

import { useEffect, useState } from 'react';
import tw from 'tailwind-styled-components';

import Action from '../../components/build/stack/Action';
import type { Stack } from './types';

const Workflow: React.FC = ({ params }: { params: { slug: string } }) => {
  const [stackInfo, setStackInfo] = useState<Stack | null>(null);
  const stackSlug = params.slug ?? null;

  useEffect(() => {
    if (!stackSlug) return;

    const fetchStackInfo = async () => {
      try {
        const url = `/stacks/v2/${stackSlug}.json`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data: Stack = await response.json();
        setStackInfo(data);
      } catch (error) {
        console.error('Failed to fetch stack info:', error);
      }
    };

    void fetchStackInfo();
  }, [stackSlug]);

  if (!stackInfo) return <div>Loading...</div>;

  return (
    <Container>
      <StackTitle>{stackInfo?.name}</StackTitle>
      <p>{stackInfo?.description}</p>
      <Trigger>Trigger: {stackInfo?.trigger.type}</Trigger>
      <ActionsContainer>
        {stackInfo?.stack.map((actionInfo, index) => (
          <Action key={index} actionInfo={actionInfo} index={index} />
        ))}
      </ActionsContainer>
    </Container>
  );
};

export default Workflow;

const Container = tw.div`
  flex
  flex-col
  items-center
  w-full
  h-screen
`;

const Trigger = tw.p`
  text-lg
  font-bold
  mb-4
`;

const ActionsContainer = tw.div`
  w-3/5
  flex
  flex-col
  justify-center
  items-center
`;

const StackTitle = tw.h1`
  text-3xl
  font-bold
  mb-4
`;
