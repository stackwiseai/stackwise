
import { createClient } from '@supabase/supabase-js'

/**
 * Brief: Insert data from the table using supabase
 */
export default async function insertDataFromTheTable({ table_name, column_name, column_value }: { table_name: string, column_name: any, column_value: any }): Promise<any> {
    try {
        const supabaseUrl = String(process.env.SUPABASE_URL)
        const supabaseKey = String(process.env.SUPABASE_KEY)
        const supabase = createClient(supabaseUrl, supabaseKey)

        const { data } = await supabase
            .from(table_name)
            .insert([
                { [column_name]: column_value},
            ])
            .select()
        return data
    } catch (error) {
        console.error(error);
    }
}