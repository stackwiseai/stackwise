'use client';

import { lazy, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { FaStar } from 'react-icons/fa';
import { FaCode } from 'react-icons/fa6';
import { IoLogoGithub } from 'react-icons/io';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import tw from 'tailwind-styled-components';

import {
  getStackDB,
  type StackDescription,
} from '../../components/stacks/utils/stack-db';

// Lazy load ClipboardComponent
const ClipboardComponent = lazy(
  () => import('@/app/components/shared/clipboard'),
);
const Link = lazy(() => import('next/link'));
const MdOutlineInput = lazy(() =>
  import('react-icons/md').then((module) => ({
    default: module.MdOutlineInput,
  })),
);

type StackDescriptionWithSlug = {
  slug: string;
} & StackDescription;

const Chat = ({ params }: { params: { slug: string } }) => {
  const [showFrontendCode, setShowFrontendCode] = useState<boolean>(true);
  const [backendCode, setBackendCode] = useState<string>('');
  const [frontendCode, setFrontendCode] = useState<string>('');
  const [dropdownSelection, setDropdownSelection] = useState<string>('Usage');
  const [stack, setStack] = useState<StackDescriptionWithSlug | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const initialStackDB = await getStackDB();
      console.log('initialStackDB', initialStackDB);
      const stackSlug = params.slug ?? null;
      if (!stackSlug) return;

      const initialStack = initialStackDB ? initialStackDB[stackSlug] : null;
      console.log('initialStack', initialStack);
      console.log('stackSlug', stackSlug);
      if (initialStack) {
        const stackWithSlug = { slug: stackSlug, ...initialStack };
        setStack(stackWithSlug);
        const frontendPath = `/stacks/${stackSlug}.tsx`;
        const backendPath = `/stacks/stacks/${stackSlug}/route.ts`;
        getPathText(frontendPath).then((data) => setFrontendCode(data));
        getPathText(backendPath).then((data) => setBackendCode(data));
      }
    };

    fetchPosts();
  }, [params.slug]);

  const DynamicComponent = useMemo(() => {
    if (!stack) return null; // FIXME: redirect or show an error, change DynamicComponent usage below as well
    return dynamic(() => import(`@/app/components/stacks/${stack.slug}`), {
      ssr: false,
      loading: () => {
        return <div>No such stack</div>;
      },
    });
  }, [stack?.slug]);

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
    <>
      <Link href="https://github.com/stackwiseai/stackwise" target="_blank">
        <div className="flex h-12 cursor-pointer items-center justify-center bg-black text-white hover:underline">
          <FaStar className="h-6 w-6 " />
          <p className="mx-2">Star us on Github</p>
          <IoLogoGithub className="h-6 w-6" />
        </div>
      </Link>

      <div className="flex">
        <Container>
          <TitleContainer>
            <Link href="/stacks">
              <div className="mb-4 flex w-full justify-center">
                <img className="w-32" src="/stackwise_logo.png" />
              </div>
            </Link>
            <Subtitle>{stack?.description}</Subtitle>
          </TitleContainer>
          <div className="flex flex-col items-center justify-center space-x-6 sm:flex-row">
            <button
              onClick={() => {
                setDropdownSelection(
                  dropdownSelection === 'Usage' ? 'Code' : 'Usage',
                );
              }}
              className="flex items-center space-x-2 rounded-md border px-2 py-1 pr-2"
            >
              <p>{dropdownSelection === 'Usage' ? 'Code' : 'Usage'}</p>
              {dropdownSelection === 'Usage' ? <FaCode /> : <MdOutlineInput />}
            </button>
            <div className="flex space-x-6 pr-6 sm:mt-0 sm:pr-0">
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
              <div className="w-3/4 rounded-md bg-[#1e1e1e] md:w-1/2">
                <div
                  className={`flex w-full items-center text-white ${
                    !backendCode && 'hidden'
                  }`}
                >
                  <button
                    onClick={() => setShowFrontendCode(true)}
                    className={`border-b border-r p-2 text-sm sm:text-base ${
                      showFrontendCode && 'border-b-2 border-b-red-400'
                    }`}
                  >
                    frontend code
                  </button>
                  {backendCode && (
                    <button
                      onClick={() => setShowFrontendCode(false)}
                      className={`rounded-br-lg border-b border-r p-2 text-sm sm:text-base ${
                        !showFrontendCode && 'border-b-2 border-b-red-400'
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
                  className="max-h-80 min-h-4 w-full overflow-auto overflow-y-hidden whitespace-pre-wrap break-all p-3 text-sm text-gray-200 sm:max-h-96 md:max-h-[28rem]"
                  style={vscDarkPlus}
                  lineProps={{
                    style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' },
                  }}
                  wrapLines={true}
                >
                  {showFrontendCode ? frontendCode : backendCode}
                </SyntaxHighlighter>
              </div>
            ) : DynamicComponent ? (
              <DynamicComponent />
            ) : (
              <></>
            )}
          </MainWrapper>
        </Container>
      </div>
    </>
  );
};

export default Chat;

const Container = tw.div`
  flex
  flex-col
  justify-center
  items-center
  h-screen
  w-full
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
