'use server';
import tw from 'tailwind-styled-components';
import Link from 'next/link';
import { stackDB } from './stack-db';
import MainContent from '../components/main-content';
import { IoLogoGithub } from 'react-icons/io';
import { FaStar } from 'react-icons/fa';

export default async function Component() {
  return (
    <div className="h-screen">
      <Link href="https://github.com/stackwiseai/stackwise" target="_blank">
        <div className="hover:underline cursor-pointer h-12 flex justify-center items-center text-white bg-black">
          <FaStar className="w-6 h-6 " />
          <p className="mx-2">Star us on Github</p>
          <IoLogoGithub className="w-6 h-6" />
        </div>
      </Link>
      <MainContent />
      <StacksContainer>
        {/* <StackTitle>Existing stacks</StackTitle> */}
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
  //mt-16 pb-8 mx-auto w-3/4 mt-14
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
