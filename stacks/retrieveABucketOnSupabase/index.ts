
import { createClient } from '@supabase/supabase-js'

/**
 * Brief: Retrieve the details of an Storage bucket in supabase
 */
export default async function retrieveBucket({ bucket_name }: { bucket_name: string }): Promise<any> {
    try {
        const supabaseUrl = String(process.env.SUPABASE_URL)
        const supabaseKey = String(process.env.SUPABASE_KEY)
        const supabase = createClient(supabaseUrl, supabaseKey)
        
        const { data } = await supabase
          .storage
          .getBucket(bucket_name)
        return data
    } catch (error) {
        console.error(error);
    }
}