'use server';
import tw from 'tailwind-styled-components';
import Content from './content';

export default async function MainContent() {
  return (
    <Container>
      <TitleContainer>
        <Title>Stackwise</Title>
        <Subtitle>Explain what you want to do.</Subtitle>
      </TitleContainer>
      <MainWrapper>
        <Content />
      </MainWrapper>
    </Container>
  );
}

const Container = tw.div`
  flex
  flex-col
  justify-end
  pt-60
  pb-20
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

const MainWrapper = tw.div`
  w-full
  flex
  flex-col
  justify-center
  items-center
`;
