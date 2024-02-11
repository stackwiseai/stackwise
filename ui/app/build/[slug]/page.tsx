import { useEffect, useState } from 'react';

import type { Stack } from './types';

interface WorkflowProps {
  slug: string;
}

const Workflow: React.FC<WorkflowProps> = ({ slug }) => {
  const [stackInfo, setStackInfo] = useState<Stack | null>(null);
  const stackSlug = slug ?? null;

  useEffect(() => {
    // this should import the jsonl file from ../../stacks/v2/${slug}.jsonl
  }, [slug]);

  return (
    <div>
      <h1>Workflow</h1>
    </div>
  );
};
