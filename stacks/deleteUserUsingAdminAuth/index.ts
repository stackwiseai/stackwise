
import { createClient } from '@supabase/supabase-js'
require('dotenv').config();

/**
 * Brief: Delete user from the supabase project using supabase Admin AUTH
 */
export default async function deleteUser({ id }: { id: any }): Promise<any> {
    try {
        const supabaseUrl = String(process.env.SUPABASE_URL)
        const supabaseServiceRole = String(process.env.SUPABASE_SERVICE_ROLE)
        const supabase = createClient(supabaseUrl, supabaseServiceRole, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })

        const { data } = await supabase.auth.admin.deleteUser(
            id
        )
        return data;
    } catch (error) {
        console.error(error);
    }
}