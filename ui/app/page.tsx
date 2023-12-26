import tw from 'tailwind-styled-components';

import ContactButton from './components/ContactButton';
import MailchimpSubscribe from './components/MailchimpSubscribe';

const Home: React.FC = () => {
  return (
    <MainContainer>
      <Logo src="/stackwise_logo.png" />
      <ContactButton />
      <MiddleSection>
        <MainText>Deploy your code with natural language</MainText>
        <ExampleWrapper>
          <pre>/ create an s3 bucket where I can upload images</pre>
          <pre>
            / deploy this NextJS route as a lambda function and make it public
            with the API Gateway
          </pre>
        </ExampleWrapper>
        <MailchimpSubscribe />
      </MiddleSection>
    </MainContainer>
  );
};

export default Home;

const MainContainer = tw.div`
    flex
    flex-col
    h-screen
    justify-center
    items-center
`;

const Logo = tw.img`
    absolute
    top-4
    left-4
    w-36
`;

const MiddleSection = tw.div`
    flex
    flex-col
    justify-center
    items-center
    w-full
    md:w-[45%]
    space-y-6
`;

const ExampleWrapper = tw.div`
    bg-black
    text-green-400
    font-mono
    text-base
    p-4
    rounded
    overflow-x-auto
    shadow-lg
`;

const MainText = tw.h1`
    font-bold
    text-4xl
`;
