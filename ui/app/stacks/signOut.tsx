"use client";

import { supabaseClient } from "./stack-db";



export default function signOut() {
  async function signOut() {
  
    const { error } = await supabaseClient.auth.signOut()
  }
  return <button onClick={signOut}>Sign Out</button>;
}

