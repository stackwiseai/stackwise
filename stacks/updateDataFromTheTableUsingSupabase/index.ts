
import { createClient } from '@supabase/supabase-js'

/**
 * Brief: Update data from the table using supabase
 */
export default async function updateDataFromTheTable(): Promise<any> {
    try {
        const supabaseUrl = String(process.env.SUPABASE_URL)
        const supabaseKey = String(process.env.SUPABASE_KEY)
        const supabase = createClient(supabaseUrl, supabaseKey)

        const { data } = await supabase
            .from('your_table')
            .update({ your_data: 'newValue' })
            .eq('your_id', 'someValue')
            .select()

        return data
    } catch (error) {
        console.error(error);
    }
}