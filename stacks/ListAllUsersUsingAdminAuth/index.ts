
import { PageParams, createClient } from '@supabase/supabase-js'
require('dotenv').config();

/**
 * Brief: Retrieve all user of the project using Admin Auth
 */
export default async function retrieveAlluser({paginate}:{paginate:PageParams}): Promise<any> {
    try {
        const supabaseUrl = String(process.env.SUPABASE_URL)
        const supabaseServiceRole = String(process.env.SUPABASE_SERVICE_ROLE)
        const supabase = createClient(supabaseUrl, supabaseServiceRole, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })

        const { data: { users }, error } = await supabase.auth.admin.listUsers(paginate)
        return users;
    } catch (error) {
        console.error(error);
    }
}