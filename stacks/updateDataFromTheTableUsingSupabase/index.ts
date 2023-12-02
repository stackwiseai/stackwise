
import { createClient } from '@supabase/supabase-js'

/**
 * Brief: Update data from the table using supabase
 */
export default async function updateDataFromTheTable({ table_name, column_name, column_value, filter_name, filter_value }: { table_name: string, column_name:string, column_value:any, filter_name:string, filter_value:any }): Promise<any> {
    try {
        const supabaseUrl = String(process.env.SUPABASE_URL)
        const supabaseKey = String(process.env.SUPABASE_KEY)
        const supabase = createClient(supabaseUrl, supabaseKey)

        const { data } = await supabase
            .from(table_name)
            .update({ [column_name]: column_value })
            .eq(filter_name, filter_value)
            .select()

        return data
    } catch (error) {
        console.error(error);
    }
}