import { getSupabaseClient } from '@/app/stacks/stack-db';
import { modifyFrontEndComponent } from '../modify-frontend-component/route';

export async function POST(req: Request) {
  try {
    //get the token from header and strip the Bearer
    const token = req.headers.get('Authorization').split(' ')[1];

    const supabase = await getSupabaseClient(token);
    // add a field to data
    const data = await req.json();
    data.tags = ['draft'];

    const { data: insertedData, error } = await supabase
      .from('stack')
      .insert([data])
      .single();

    const responseJson = await modifyFrontEndComponent('test', data.id, false);

    if (error) {
      throw error;
    }

    await supabase.rpc('commit');

    // Return a success response
    return new Response(JSON.stringify(insertedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error during data insertion:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
