
import { createClient } from '@supabase/supabase-js'

/**
 * Brief: List all Storage buckets in supabase
 */
export default async function listAllBuckets(): Promise<any> {
    try {
        const supabaseUrl = String(process.env.SUPABASE_URL)
        const supabaseKey = String(process.env.SUPABASE_KEY)
        const supabase = createClient(supabaseUrl, supabaseKey)


        const { data } = await supabase
            .storage
            .listBuckets()
        return data
    } catch (error) {
        console.error(error);
    }
}