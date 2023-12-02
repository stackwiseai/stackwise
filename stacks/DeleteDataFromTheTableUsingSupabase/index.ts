
import { createClient } from '@supabase/supabase-js'

/**
 * Brief: Delete data from the table using supabase
 */
export default async function deleteDataFromTheTable({table_name, filter_name, filter_value}:{table_name:string, filter_name:any, filter_value:any}): Promise<any> {
    try {
        const supabaseUrl = String(process.env.SUPABASE_URL)
        const supabaseKey = String(process.env.SUPABASE_KEY)
        const supabase = createClient(supabaseUrl, supabaseKey)

        const { data } = await supabase
            .from(table_name)
            .delete()
            .eq(filter_name, filter_value)
            .select()

        return data
    } catch (error) {
        console.error(error);
    }
}