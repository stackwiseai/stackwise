export async function POST(req: Request) {
  const { input } = await req.json();
  return new Response(
    JSON.stringify({ output: `You sent this message to the server: ${input}` }),
  );
}
