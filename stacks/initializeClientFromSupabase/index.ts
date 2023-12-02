
import { createClient } from '@supabase/supabase-js'
require('dotenv').config();

/**
 * Brief: Initialize a client using supabase
 */
export default async function initializeClientUsingSupabase(): Promise<any> {
    try {
const supabaseUrl = String(process.env.SUPABASE_URL)
const supabaseKey = String(process.env.SUPABASE_KEY)
const supabase = createClient(supabaseUrl, supabaseKey)
return supabase
    } catch (error) {
        console.error(error);
    }
}