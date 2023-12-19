"use client";

import { supabaseClient } from "./stack-db";


export default function signIn() {
 
  async function signInWithGithub() {
    
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: "github",
      options: {
        scopes: 'public_repo',
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/stacks/create-stack-boilerplate`
      },
    });
  }
  return (
    <button 
      onClick={signInWithGithub}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Sign in with Github
    </button>
  );
}
