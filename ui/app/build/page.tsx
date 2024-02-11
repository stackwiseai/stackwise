import tw from 'tailwind-styled-components';

import Builder from '../components/build/Builder';

const BuildPage: React.FC = () => {
  return (
    <Container>
      <ContentWrapper>
        <div className="mb-4 flex w-full justify-center">
          <img className="w-64" src="/stackwise_logo.png" />
        </div>
        <Builder />
      </ContentWrapper>
    </Container>
  );
};

export default BuildPage;

const Container = tw.div`
  flex
  flex-col
  justify-center
  items-center
  w-full
  h-screen
`;

const ContentWrapper = tw.div`
    w-3/5
    flex
    flex-col
    justify-center
    items-center
    mt-10
    `;
