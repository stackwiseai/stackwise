
import { createClient } from '@supabase/supabase-js'

/**
 * Brief: Fetch data from table using supabase
 */
export default async function fetchDataFromTableUsingSupabase({ table_name, filter }: { table_name: string, filter: string }): Promise<any> {
    try {
        const supabaseUrl = String(process.env.SUPABASE_URL)
        const supabaseKey = String(process.env.SUPABASE_KEY)
        const supabase = createClient(supabaseUrl, supabaseKey)
        const { data } = await supabase
            .from(table_name)
            .select(filter)
        return data
    } catch (error) {
        console.error(error);
    }
}