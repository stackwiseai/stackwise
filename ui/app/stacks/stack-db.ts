import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

type Status = 'published' | 'starred' | 'expansion';
export const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
export async function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  );
}

export async function getStackDB() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  );
  const { data: projectsArray, error } = await supabase
    .from('stack') // Replace with your actual table name
    .select('*');

  if (error) {
    console.error('Error fetching data:', error);
    return null;
  }

  const projectsObject: Record<string, StackDescription> = {};
  if (projectsArray) {
    projectsArray.forEach((project) => {
      projectsObject[project.id] = {
        name: project.name,
        description: project.description,
        tags: project.tags,
      };
    });
  }

  return projectsObject;
}

export interface StackDescription {
  name: string;
  description: string;
  tags: Status[];
}

export const statusesToDisplay: Status[] = ['published'];
