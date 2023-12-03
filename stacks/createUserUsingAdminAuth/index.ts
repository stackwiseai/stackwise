
import { createClient } from '@supabase/supabase-js'
require('dotenv').config();

/**
 * Brief: Create a new user for the project using supabase Admin AUTH
 */
export default async function createUser({ userData }: { userData: any }): Promise<any> {
    try {
        const supabaseUrl = String(process.env.SUPABASE_URL)
        const supabaseServiceRole = String(process.env.SUPABASE_SERVICE_ROLE)
        const supabase = createClient(supabaseUrl, supabaseServiceRole, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })


        const { data } = await supabase.auth.admin.createUser(userData)
        return data;
    } catch (error) {
        console.error(error);
    }
}