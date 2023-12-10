import Link from 'next/link';
import { stackDB } from './stackDB';

export default function Component() {
  return (
    <div className="p-4">
      <ul className="space-y-4">
        {Object.entries(stackDB).map(([id, stack]) => (
          <li key={id} className="flex justify-between items-center">
            <Link
              className="text-blue-600 hover:underline"
              href={`/stacks/${id}`}
            >
              {stack.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
