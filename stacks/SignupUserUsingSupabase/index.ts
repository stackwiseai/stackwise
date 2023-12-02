
import { createClient } from '@supabase/supabase-js'

/**
 * Brief: Fetch all data from the table using supabase
 */
export default async function fetchDataFromTableUsingSupabase({email,password}:{email:string,password:string}): Promise<any> {
    try {
        const supabaseUrl = String(process.env.SUPABASE_URL)
        const supabaseKey = String(process.env.SUPABASE_KEY)
        const supabase = createClient(supabaseUrl, supabaseKey)
        let { data } = await supabase.auth.signUp({
            email: email,
            password: password
          })
        return data
    } catch (error) {
        console.error(error);
    }
}