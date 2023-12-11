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
import { stackDB } from '../stackDB';

const Chat = ({ params }: { params: { slug: string } }) => {
  const [showFrontendCode, setShowFrontendCode] = useState<boolean>(false);
  const [backendCode, setBackendCode] = useState<string>('');
  const [frontendCode, setFrontendCode] = useState<string>('');
  const [dropdownSelection, setDropdownSelection] = useState<string>('Usage');
  const stackUuid = params.slug ?? null;
  const stackName = stackDB[`${stackUuid}`].name;

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
    const data = await response.text();
    return data;
  };

  const frontendPath = '/stacks/chatWithOpenAIStreaming/frontend.txt';
  const backendPath = '/stacks/chatWithOpenAIStreaming/backend.txt';

  useEffect(() => {
    getPathText(frontendPath).then((data) => setFrontendCode(data));
    getPathText(backendPath).then((data) => setBackendCode(data));
  }, []);

  return (
    <Container>
      <Link
        className="cursor-pointer fixed bottom-4 right-4"
        href="https://github.com/stackwiseai/stackwise"
        target="_blank"
      >
        <IoLogoGithub className="w-8 h-8" />
      </Link>
      <Link
        className="cursor-pointer fixed bottom-4 left-4"
        href="mailto:silen@stackwise.ai"
      >
        Not happy with the code? <br></br>
        Email <b>contact@stackwise.ai</b>
      </Link>
      <TitleContainer>
        <div className="w-full mb-4 flex justify-center">
          <img className="w-32" src="/stackwise_logo.png" />
        </div>
        <Subtitle>stackIdToName.stackUuid.description</Subtitle>
      </TitleContainer>
      <div className="flex items-center space-x-6">
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
        <ClipboardComponent
          title={
            <>
              Copy <b className="text-black">Frontend</b>
            </>
          }
          path={frontendPath}
        />
        <ClipboardComponent
          title={
            <>
              Copy <b className="text-black">Backend</b>
            </>
          }
          path={backendPath}
        />
      </div>
      <MainWrapper>
        {dropdownSelection === 'Code' ? (
          <div className="bg-[#1e1e1e] rounded-md w-full">
            <div className="text-white flex items-center w-full">
              <button
                onClick={() => setShowFrontendCode(true)}
                className={`border-r border-b p-2 ${
                  showFrontendCode && 'border-b-red-400 border-b-2'
                }`}
              >
                frontend code
              </button>
              <button
                onClick={() => setShowFrontendCode(false)}
                className={`border-r border-b p-2 rounded-br-lg ${
                  !showFrontendCode && 'border-b-red-400 border-b-2'
                }`}
              >
                backend code
              </button>
            </div>
            {/* <pre className="min-h-4 p-3 max-h-96 w-full overflow-auto text-gray-200 text-sm whitespace-pre-wrap break-all">
              {showFrontendCode ? frontendCode : backendCode}
            </pre> */}
            <SyntaxHighlighter
              language="javascript"
              className="min-h-4 p-3 max-h-96 w-full overflow-auto overflow-y-hidden text-gray-200 text-sm whitespace-pre-wrap break-all"
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
`;

const TitleContainer = tw.div`
  text-center
  flex
  flex-col
  items-center
  h-[45%]
  justify-end
  w-1/2
`;
const Subtitle = tw.p`
  text-lg
`;

const MainWrapper = tw.div`
  w-1/2
  flex
  flex-col
  items-center
  h-[55%]
`;
