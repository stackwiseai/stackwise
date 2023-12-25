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
        <div>
          <pre>/ create an s3 bucket where I can upload images</pre>
          <pre>
            / deploy this NextJS route as a lambda function and set up an api
            gateway for it
          </pre>
        </div>
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
    w-40
`;

const MiddleSection = tw.div`
    flex
    flex-col
    justify-center
    items-center
    w-full
`;

const MainText = tw.h1`
    font-medium
    text-4xl
`;
