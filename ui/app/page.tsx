'use server';
import tw from 'tailwind-styled-components';
import Image from 'next/image';
import InputWithButton from './components/InputWithButton';

export default async function Home() {
  return (
    <Container>
      <div>
        <TitleContainer>
          <Title>Stackwise</Title>
          <Subtitle>Explain what you want to do.</Subtitle>
        </TitleContainer>
        <InputWithButton />
      </div>
    </Container>
  );
}

const Container = tw.div`
  flex
  justify-center
  items-center
  h-screen
`;

const TitleContainer = tw.div`
  text-center
  mb-8
`;

const Title = tw.h1`
  text-2xl
  font-bold
`;

const Subtitle = tw.p`
  text-lg
`;

const Input = tw.input`
  rounded-md
  p-3
  border
  border-gray-300
  focus:outline-none
  focus:border-blue-500
  transition
  duration-200
  w-[500px]
`;
