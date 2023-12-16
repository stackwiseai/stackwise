import { getSupabaseClient } from '@/app/stacks/stack-db';
import { readFileSync } from 'fs';
import { pushStackToGithub } from '../modify-frontend-component/push-stack-to-github';

export async function POST(req: Request) {
  try {
    const frontEndFileContent = readFileSync(
      `app/components/stacks/boilerplate-basic.tsx`,
      'utf8'
    );
    const token = req.headers.get('Authorization').split(' ')[1];
    const supabase = await getSupabaseClient(token);
    // add a field to data
    const data = await req.json();
    data.tags = ['draft'];
    const { data: insertedData, error } = await supabase
      .from('stack')
      .insert([data])
      .single();
    const path = `ui/app/components/stacks/${data.id}.tsx`;
    const message = `Stack ${data.id} created`;

    const responseJson = await pushStackToGithub(
      frontEndFileContent,
      path,
      message
    );
    if (error) {
      throw error;
    }
    await supabase.rpc('commit');
    // Return a success response
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    //return 500
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// import { getSupabaseClient } from '@/app/stacks/stack-db';
// import { modifyFrontEndComponent } from '../modify-frontend-component/route';
// import { readFileSync } from 'fs';

// const frontEndFileContent = readFileSync(
//   `/app/components/stacks/boilerplate-basic.tsx`,
//   'utf8'
// );

// export async function POST(req: Request) {
//   try {
//     //get the token from header and strip the Bearer
//     const token = req.headers.get('Authorization').split(' ')[1];

//     const supabase = await getSupabaseClient(token);

//     // add a field to data
//     const data = await req.json();
//     data.tags = ['draft'];

//     const { data: insertedData, error } = await supabase
//       .from('stack')
//       .insert([data])
//       .single();

//     const responseJson = await modifyFrontEndComponent(
//       frontEndFileContent,
//       data.id,
//       false
//     );

//     if (error) {
//       throw error;
//     }

//     await supabase.rpc('commit');

//     // Return a success response
//     return new Response(JSON.stringify(insertedData), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     console.error('Error during data insertion:', error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// }

// import { getSupabaseClient } from '@/app/stacks/stack-db';
// import { modifyFrontEndComponent } from '../modify-frontend-component/route';
// import { readFileSync } from 'fs';

// const frontEndFileContent = readFileSync(
//   `/app/components/stacks/boilerplate-basic.tsx`,
//   'utf8'
// );

// export async function POST(req: Request) {
//   try {
//     //get the token from header and strip the Bearer
//     const token = req.headers.get('Authorization').split(' ')[1];

//     const supabase = await getSupabaseClient(token);

//     // add a field to data
//     const data = await req.json();
//     data.tags = ['draft'];

//     const { data: insertedData, error } = await supabase
//       .from('stack')
//       .insert([data])
//       .single();

//     const responseJson = await modifyFrontEndComponent(
//       frontEndFileContent,
//       data.id,
//       false
//     );

//     if (error) {
//       throw error;
//     }

//     await supabase.rpc('commit');

//     // Return a success response
//     return new Response(JSON.stringify(insertedData), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     console.error('Error during data insertion:', error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// }
