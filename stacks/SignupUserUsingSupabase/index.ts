
import { createClient } from '@supabase/supabase-js'

/**
 * Brief: Sign Up and Create a New Account on a Project in Supabase Client
 */
export default async function signupAndCreateAccountOnProject({email,password}:{email:string,password:string}): Promise<any> {
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