'use server';

import tw from 'tailwind-styled-components';

import Content from './content';

export default async function MainContent({ stackDB }) {
  return (
    <Container>
      <TitleContainer>
        <div className="mb-4 flex w-full justify-center">
          <img className="w-32" src="/stackwise_logo.png" />
        </div>
        <Subtitle>The open source function collection.</Subtitle>
      </TitleContainer>
      <MainWrapper>
        <Content stackDB={stackDB} />
      </MainWrapper>
    </Container>
  );
}

const Container = tw.div`
  flex
  flex-col
  justify-end
  //pt-60
  pt-24
  pb-5
  //pb-10
`;

const TitleContainer = tw.div`
  text-center
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
