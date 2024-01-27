import Replicate from 'replicate'

export async function POST(req: Request) {
  const replicate = new Replicate({
    auth: 'r8_7RvsvBjuJNX4c8hy1WIuNwk7xqbaeBr4MICxT',
  });

  const { prompt, modelType } = await req.json();
  console.log(prompt, modelType)

  // Determine which model to use based on modelType
  const modelId : `${string}/${string}:${string}` = modelType === 'mixtral' 
                  ? "mistralai/mixtral-8x7b-instruct-v0.1:2b56576fcfbe32fa0526897d8385dd3fb3d36ba6fd0dbe033c72886b81ade93e"
                  : "meta/llama-2-7b:acdbe5a4987a29261ba7d7d4195ad4fa6b62ce27b034f989fcb9ab0421408a7c";
  const input = {
    top_k: 10,
    top_p: 0.90,
    prompt: `You are a rapper, and you need to rap about this topic, write a new rap, or just continue: ${prompt}`,
    temperature: 0.6,
    max_new_tokens: 128,
    repetition_penalty: 1.15  };

  let output;
  try {
    output = await replicate.run(modelId, { input });
    return new Response(
      JSON.stringify( { output: output})
    )
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error }), {
      status: 500,
    });
  }
}
