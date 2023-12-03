
import { createClient } from '@supabase/supabase-js'
require('dotenv').config();

/**
 * Brief: Retrieve a user object using Supabase AUTH Admin
 */
export default async function retrieveUser({ id }: { id: any }): Promise<any> {
    try {
        const supabaseUrl = String(process.env.SUPABASE_URL)
        const supabaseServiceRole = String(process.env.SUPABASE_SERVICE_ROLE)
        const supabase = createClient(supabaseUrl, supabaseServiceRole, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })
        const { data } = await supabase.auth.admin.getUserById(id)
        return data;
    } catch (error) {
        console.error(error);
    }
}