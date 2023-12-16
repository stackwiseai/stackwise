import { createClient } from "@supabase/supabase-js";

type Status = "published" | "starred" | "expansion";
export const fetchCache = "default-no-store"; // TODO: remove this line to enable caching but without making the app completely static

export async function getSupabaseClient(token) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      db: {
        schema: "public",
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  );
}

export async function getStackDB() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  );
  const { data: projectsArray, error } = await supabase
    .from("stack") // Replace with your actual table name
    .select("*");

  if (error) {
    console.error("Error fetching data:", error);
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

export const statusesToDisplay: Status[] = ["published"];
