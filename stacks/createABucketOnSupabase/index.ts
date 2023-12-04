
import { createClient } from '@supabase/supabase-js'

/**
 * Brief: Fetch data from table in SUPABASE in CSV Format
 */
type options = {
    public: boolean;
    fileSizeLimit?: string | number | null | undefined;
    allowedMimeTypes?: string[] | null | undefined;
}
export default async function createABucketOnSupabase({ bucket_name, options }: { bucket_name: string, options: options }): Promise<any> {
    try {
        const supabaseUrl = String(process.env.SUPABASE_URL)
        const supabaseKey = String(process.env.SUPABASE_KEY)
        const supabase = createClient(supabaseUrl, supabaseKey)
        const { data, error } = await supabase
            .storage
            .createBucket(bucket_name, options)
            console.log(error);
        return data
    } catch (error) {
        console.error(error);
    }
}