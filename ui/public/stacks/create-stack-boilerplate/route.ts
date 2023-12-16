import { getSupabaseClient } from "@/app/stacks/stack-db";

export async function POST(req: Request) {
  try {
    //get the token from header and strip the Bearer
    const authorizationHeaders = req.headers.get("Authorization");
    if (!authorizationHeaders) {
      throw new Error("No token provided");
    }
    const authorizationHeadersSplit = authorizationHeaders.split(" ");
    if (!authorizationHeadersSplit) {
      throw new Error("Invalid token provided");
    }
    const token = authorizationHeadersSplit;

    const supabase = await getSupabaseClient(token);
    // add a field to data
    const data = await req.json();
    data.tags = ["draft"];

    const { data: insertedData, error } = await supabase
      .from("stack")
      .insert([data])
      .single();

    if (error) {
      throw error;
    }

    await supabase.rpc("commit");

    // Return a success response
    return new Response(JSON.stringify(insertedData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error during data insertion:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
