
import { createClient } from '@supabase/supabase-js'

/**
 * Brief: Delete data from the table using supabase
 */
export default async function deleteDataFromTheTable(): Promise<any> {
    try {
        const supabaseUrl = String(process.env.SUPABASE_URL)
        const supabaseKey = String(process.env.SUPABASE_KEY)
        const supabase = createClient(supabaseUrl, supabaseKey)

        const { data } = await supabase
            .from('your_table')
            .delete()
            .eq('your_id', 1)
            .select()

        return data
    } catch (error) {
        console.error(error);
    }
}