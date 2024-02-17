'use client';

import { supabaseClient } from './stack-db';

export default function signIn() {
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` // Use Vercel's environment variable in production
      : 'http://localhost:3000'; // Default to localhost in development

  async function signInWithGithub() {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'github',
      options: {
        scopes: 'public_repo',
        redirectTo: `${baseUrl}/stacks/create-stack-boilerplate`,
      },
    });
  }
  return (
    <button
      onClick={signInWithGithub}
      className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
    >
      Sign in with Github
    </button>
  );
}
