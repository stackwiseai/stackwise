
import { createClient } from '@supabase/supabase-js'

/**
 * Brief: Fetch data from table in SUPABASE in CSV Format
 */
export default async function fetchDataFromTableInCSVUsingSupabase({ table_name }: { table_name: string }): Promise<any> {
    try {
        const supabaseUrl = String(process.env.SUPABASE_URL)
        const supabaseKey = String(process.env.SUPABASE_KEY)
        const supabase = createClient(supabaseUrl, supabaseKey)
        const { data } = await supabase
        .from(table_name)
        .select()
        .csv()
        return data
    } catch (error) {
        console.error(error);
    }
}