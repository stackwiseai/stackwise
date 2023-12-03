
import { createClient } from '@supabase/supabase-js'

/**
 * Brief: Authenticate and login existing user using email and password on supabase
 */
export default async function loginExistingUserWithEmailPassword({email,password}:{email:string,password:string}): Promise<any> {
    try {
        const supabaseUrl = String(process.env.SUPABASE_URL)
        const supabaseKey = String(process.env.SUPABASE_KEY)
        const supabase = createClient(supabaseUrl, supabaseKey)
        const { data } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          })
        return data
    } catch (error) {
        console.error(error);
    }
}