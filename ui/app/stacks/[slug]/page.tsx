'use client';
import { useEffect, useState } from 'react';
import ClipboardComponent from '@/app/components/clipboard';
import tw from 'tailwind-styled-components';
import Link from 'next/link';
import { FaCode } from 'react-icons/fa6';
import { IoLogoGithub } from 'react-icons/io';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MdOutlineInput } from 'react-icons/md';
import dynamic from 'next/dynamic';
import { stackDB as initialStackDB } from '../stackDB';
import ContactStackwise from '@/app/components/ContactStackwise';
import { useSearchParams } from 'next/navigation';
import { ChatWithStack } from './Chat';

const Chat = ({ params }: { params: { slug: string } }) => {
  const searchParams = useSearchParams();

  const chatWithComponent = searchParams.get('chat');
  const [showFrontendCode, setShowFrontendCode] = useState<boolean>(true);
  const [backendCode, setBackendCode] = useState<string>('');
  const [frontendCode, setFrontendCode] = useState<string>('');
  const [dropdownSelection, setDropdownSelection] = useState<string>('Usage');
  const [stackName, setStackName] = useState(null);
  const [stackDescription, setStackDescription] = useState('');

  useEffect(() => {
    const stackUuid = params.slug ?? null;
    if (!stackUuid) return;

    console.log('stackUuid', stackUuid);
    const stackInfo = initialStackDB[stackUuid] || null;
    if (stackInfo) {
      console.log('stackInfo', stackInfo);
      setStackName(stackInfo.name);
      setStackDescription(stackInfo.description);
      const frontendPath = `/stacks/${stackInfo.name}.tsx`;
      const backendPath = `/stacks/${stackInfo.name}/route.ts`;
      getPathText(frontendPath).then((data) => setFrontendCode(data));
      getPathText(backendPath).then((data) => setBackendCode(data));
    }
  }, [params.slug]);

  const DynamicComponent = dynamic(
    () => import(`@/app/components/stacks/${stackName}`),
    {
      ssr: false,
      loading: () => {
        return <div></div>;
      },
    }
  );

  const getPathText = async (path: string) => {
    const response = await fetch(path);

    // Check if the fetch was successful
    if (response.ok) {
      // If the response status is 2xx, return the text
      const data = await response.text();
      return data;
    } else {
      // If the response status is not 2xx, return an empty string
      return '';
    }
  };

  return (
    <div className="flex">
      <Container style={{ width: chatWithComponent ? '50%' : '100%' }}>
        <Link
          className="cursor-pointer absolute sm:fixed top-4 sm:top-auto sm:bottom-4 right-4"
          href="https://github.com/stackwiseai/stackwise"
          target="_blank"
        >
          <IoLogoGithub className="w-8 h-8" />
        </Link>
        <ContactStackwise />
        <TitleContainer>
          <div className="w-full mb-4 flex justify-center">
            <img className="w-32" src="/stackwise_logo.png" />
          </div>
          <Subtitle>{stackDescription}</Subtitle>
        </TitleContainer>
        <div className="flex items-center justify-center flex-col sm:flex-row space-x-6">
          <button
            onClick={() => {
              setDropdownSelection(
                dropdownSelection === 'Usage' ? 'Code' : 'Usage'
              );
            }}
            className="border rounded-md px-2 py-1 pr-2 flex items-center space-x-2"
          >
            <p>{dropdownSelection === 'Usage' ? 'Code' : 'Usage'}</p>
            {dropdownSelection === 'Usage' ? <FaCode /> : <MdOutlineInput />}
          </button>
          <div className="flex pr-6 sm:pr-0 space-x-6 sm:mt-0">
            <ClipboardComponent
              title={
                <>
                  Copy{' '}
                  <b className="text-black">
                    {backendCode ? 'frontend' : 'code'}
                  </b>
                </>
              }
              code={frontendCode}
            />
            {backendCode && (
              <ClipboardComponent
                title={
                  <>
                    Copy <b className="text-black">backend</b>
                  </>
                }
                code={backendCode}
              />
            )}
          </div>
        </div>
        <MainWrapper>
          {dropdownSelection === 'Code' ? (
            <div className="bg-[#1e1e1e] rounded-md w-3/4 md:w-1/2">
              <div
                className={`text-white flex items-center w-full ${
                  !backendCode && 'hidden'
                }`}
              >
                <button
                  onClick={() => setShowFrontendCode(true)}
                  className={`text-sm sm:text-base border-r border-b p-2 ${
                    showFrontendCode && 'border-b-red-400 border-b-2'
                  }`}
                >
                  frontend code
                </button>
                {backendCode && (
                  <button
                    onClick={() => setShowFrontendCode(false)}
                    className={`text-sm sm:text-base border-r border-b p-2 rounded-br-lg ${
                      !showFrontendCode && 'border-b-red-400 border-b-2'
                    }`}
                  >
                    backend code
                  </button>
                )}
              </div>
              {/* <pre className="min-h-4 p-3 max-h-96 w-full overflow-auto text-gray-200 text-sm whitespace-pre-wrap break-all">
              {showFrontendCode ? frontendCode : backendCode}
            </pre> */}
              <SyntaxHighlighter
                language="javascript"
                className="min-h-4 p-3 max-h-80 sm:max-h-96 md:max-h-[28rem] w-full overflow-auto overflow-y-hidden text-gray-200 text-sm whitespace-pre-wrap break-all"
                style={vscDarkPlus}
                lineProps={{
                  style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' },
                }}
                wrapLines={true}
              >
                {showFrontendCode ? frontendCode : backendCode}
              </SyntaxHighlighter>
            </div>
          ) : (
            <DynamicComponent />
          )}
        </MainWrapper>
      </Container>
      {chatWithComponent && <ChatWithStack />}
    </div>
  );
};

export default Chat;

const Container = tw.div`
  flex
  flex-col
  justify-center
  items-center
  h-screen
  space-y-6
  pb-32
`;

const TitleContainer = tw.div`
  text-center
  flex
  flex-col
  items-center
  h-[40%]
  justify-end
  sm:w-1/2
  w-full
  px-2
`;
const Subtitle = tw.p`
  text-base
  text-center
  sm:text-lg
`;

const MainWrapper = tw.div`
  w-full
  flex
  flex-col
  items-center
  h-[60%]
  pb-4
`;
