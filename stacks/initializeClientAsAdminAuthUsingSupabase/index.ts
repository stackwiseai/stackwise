
import { createClient } from '@supabase/supabase-js'
require('dotenv').config();

/**
 * Brief: Initialize supabase client as admin auth
 */
export default async function initializeAdminAuth(): Promise<any> {
    try {
        const supabaseUrl = String(process.env.SUPABASE_URL)
        const supabaseServiceRole = String(process.env.SUPABASE_SERVICE_ROLE)
        const supabase = createClient(supabaseUrl, supabaseServiceRole, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })
        return supabase.auth.admin
    } catch (error) {
        console.error(error);
    }
}