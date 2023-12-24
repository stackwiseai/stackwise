import tw from 'tailwind-styled-components';

import MailchimpSubscribe from './components/MailchimpSubscribe';

const Home: React.FC = () => {
  return (
    <MainContainer>
      <Logo src="/stackwise_logo.png" />
      <ContactButton>Contact Us</ContactButton>
      <MiddleSection>
        <p>Deploy your code with natural language</p>
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
`;

const ContactButton = tw.button`
  bg-black
  hover:bg-gray-800
  text-white
  font-bold
  py-2
  px-4
  rounded-full
  absolute
  top-4
  right-4
  transition duration-300 ease-in-out
  shadow-lg
  hover:shadow-xl
  hover:shadow-gradient
`;
