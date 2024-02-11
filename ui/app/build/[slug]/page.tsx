'use client';

import { useEffect, useState } from 'react';

import type { Stack } from './types';

const Workflow: React.FC = ({ params }: { params: { slug: string } }) => {
  const [stackInfo, setStackInfo] = useState<Stack | null>(null);
  const stackSlug = params.slug ?? null;
  console.log('stackSlug', stackSlug);

  useEffect(() => {
    // import(`../../stacks/v2/${stackSlug}.json`)
    //   .then((module) => {
    //     setStackInfo(module.default);
    //   })
    //   .catch((err) => {
    //     console.error('Failed to load the stack info', err);
    //   });
    // console.log('stackInfo', stackInfo);
  }, [stackSlug]);

  return (
    <div>
      <h1>Workflow</h1>
    </div>
  );
};

export default Workflow;
