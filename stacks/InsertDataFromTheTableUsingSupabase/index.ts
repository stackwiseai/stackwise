
import { createClient } from '@supabase/supabase-js'

/**
 * Brief: Insert data from the table using supabase
 */
export default async function insertDataFromTheTable(): Promise<any> {
    try {
        const supabaseUrl = String(process.env.SUPABASE_URL)
        const supabaseKey = String(process.env.SUPABASE_KEY)
        const supabase = createClient(supabaseUrl, supabaseKey)

        const { data } = await supabase
        .from('your_table')
        .insert([
          {your_data:'What is your name'},
        ])
        .select()
        return data
    } catch (error) {
        console.error(error);
    }
}