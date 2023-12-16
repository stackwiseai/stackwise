import Link from "next/link";
import { SignedIn, SignOutButton } from "@clerk/nextjs";
import { FaStar } from "react-icons/fa";
import { IoLogoGithub } from "react-icons/io";
import tw from "tailwind-styled-components";

import MainContent from "../components/main-content";
import type { StackDescription } from "./stack-db";
import { getStackDB, statusesToDisplay } from "./stack-db";

export const fetchCache = "force-no-store"; // TODO: remove this line to enable caching but without making the app completely static

export default async function Component() {
  // console.log('statusesToDisplay', statusesToDisplay);
  const stackDB = await getStackDB();
  const filteredStacks = Object.entries(stackDB || {}).filter(([id, stack]) => {
    return statusesToDisplay.some((status) =>
      stack.tags ? stack.tags.includes(status) : false,
    );
  });

  const sortStacks = (
    a: [string, StackDescription],
    b: [string, StackDescription],
  ): number => {
    const [, stackA] = a;
    const [, stackB] = b;

    const isAStarred = stackA.tags.includes("starred");
    const isBStarred = stackB.tags.includes("starred");
    const isAPublishedNonExpansion =
      stackA.tags.includes("published") && !stackA.tags.includes("expansion");
    const isBPublishedNonExpansion =
      stackB.tags.includes("published") && !stackB.tags.includes("expansion");
    const isAExpansion = stackA.tags.includes("expansion");
    const isBExpansion = stackB.tags.includes("expansion");

    // Sorting logic
    if (isAStarred && !isBStarred) return -1;
    if (!isAStarred && isBStarred) return 1;
    if (isAPublishedNonExpansion && !isBPublishedNonExpansion) return -1;
    if (!isAPublishedNonExpansion && isBPublishedNonExpansion) return 1;
    if (isAExpansion && !isBExpansion) return -1;
    if (!isAExpansion && isBExpansion) return 1;
    return 0;
  };

  // // Assuming filteredStacks is defined correctly as an array of [string, StackDescription] tuples
  const sortedStacks = Object.fromEntries(filteredStacks.sort(sortStacks));

  return (
    <div className="h-screen">
      <Link href="https://github.com/stackwiseai/stackwise" target="_blank">
        <div className="flex h-12 cursor-pointer items-center justify-center bg-black text-white hover:underline">
          <FaStar className="h-6 w-6 " />
          <p className="mx-2">Star us on Github</p>
          <IoLogoGithub className="h-6 w-6" />
        </div>
      </Link>

      <MainContent stackDB={stackDB} />
      <StacksContainer>
        <Stacks>
          {Object.entries(sortedStacks).map(([id, stack], i) => (
            <Link key={i} className="cursor-pointer" href={`/stacks/${id}`}>
              <StackCard>
                <div className="flex items-center justify-between">
                  <StackCardTitle>{stack.name}</StackCardTitle>
                  <div>
                    {stack.tags.includes("starred") && (
                      <FaStar className="h-4 w-4 text-yellow-300" />
                    )}
                  </div>
                </div>
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

      <SignedIn>
        <SignOutButton />
      </SignedIn>
    </div>
  );
}

const StacksContainer = tw.div`
  //mt-16 pb-8 mx-auto px-4 w-full md:w-5/6 xl:w-3/4 mt-14
`;
const StackTitle = tw.h1`
  text-xl font-medium
  mb-8 
`;

const Stacks = tw.div`
  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4
  
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
  overflow-hidden
`;

const StackCardImage = tw.img`
  w-full object-cover max-h-32
`;

const StackCardDescription = tw.div`
  line-clamp-2
  h-12
`;
