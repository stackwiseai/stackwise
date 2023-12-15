import { createClient } from '@supabase/supabase-js';
type Status = 'published' | 'starred' | 'expansion';
const supabaseclient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
export async function getStackDB() {
  let { data: projectsArray, error } = await supabaseclient
    .from('stack') // Replace with your actual table name
    .select('*');

  if (error) {
    console.error('Error fetching data:', error);
    return null;
  }

  const projectsObject: Record<string, StackDescription> = {};
  projectsArray.forEach((project) => {
    projectsObject[project.id] = {
      name: project.name,
      description: project.description,
      tags: project.tags,
    };
  });

  return projectsObject;
}

export type StackDescription = {
  name: string;
  description: string;
  tags: Status[];
};

export const statusesToDisplay: Status[] = ['published'];
