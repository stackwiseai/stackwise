'use server';
import tw from 'tailwind-styled-components';
import Link from 'next/link';
import { stackDB } from './stack-db';
import MainContent from '../components/main-content';
import { IoLogoGithub } from 'react-icons/io';

export default async function Component() {
  return (
    <div className="p-4 h-screen">
      <Link
        className="cursor-pointer absolute sm:fixed top-4 sm:top-auto right-4"
        href="https://github.com/stackwiseai/stackwise"
        target="_blank"
      >
        <IoLogoGithub className="w-8 h-8" />
      </Link>
      <Link
        className="cursor-pointer absolute sm:fixed top-4 sm:top-auto ;eft-4"
        href="https://github.com/stackwiseai/stackwise"
        target="_blank"
      >
        <img className="w-32" src="/stackwise_logo.png" />
      </Link>
      <MainContent />
      <StacksContainer>
        <StackTitle>Existing stacks</StackTitle>
        <Stacks>
          {Object.entries(stackDB).map(([id, stack], i) => (
            <Link key={i} className="cursor-pointer" href={`/stacks/${id}`}>
              <StackCard>
                <StackCardTitle>{stack.name}</StackCardTitle>
                <StackCardImage
                  src={`/stack-pictures/${id}.png`}
                  alt="Stack Image"
                />
                <StackCardDescription>
                  <p>{stack.description}</p>
                </StackCardDescription>
              </StackCard>
            </Link>
          ))}
        </Stacks>
      </StacksContainer>
    </div>
  );
}

const StacksContainer = tw.div`
  mt-16 pb-8 mx-auto w-3/4
`;
const StackTitle = tw.h1`
  text-xl font-medium
  mb-8 
`;

const Stacks = tw.div`
  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
  
`;

const StackCard = tw.div`
  bg-white border rounded-lg overflow-hidden h-64
  flex flex-col justify-between
  py-2
  px-4
`;

const StackCardTitle = tw.h2`
  font-medium
  line-clamp-1
`;

const StackCardImage = tw.img`
  w-full object-cover max-h-32
`;

const StackCardDescription = tw.div`
  line-clamp-2
  h-12
  overflow-hidden
`;
