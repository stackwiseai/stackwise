
import { createClient } from '@supabase/supabase-js'

/**
 * Brief: Fetch all data from the table using supabase
 */
export default async function fetchDataFromTableUsingSupabase(): Promise<any> {
    try {
        const supabaseUrl = String(process.env.SUPABASE_URL)
        const supabaseKey = String(process.env.SUPABASE_KEY)
        const supabase = createClient(supabaseUrl, supabaseKey)
        const { data } = await supabase
            .from('your_table')
            .select('*')
        return data
    } catch (error) {
        console.error(error);
    }
}