import Replicate from "replicate";
/**
 * Brief: Generate an image usiung replicate
 */

type inputType = {
    prompt: string
}
type modelType = `${string}/${string}:${string}`

interface ModelInfo  {
    model: modelType,
    input: inputType
}
export default async function generateImageUsingReplicate({ model, input }: ModelInfo): Promise<any> {
    try {
        const replicate = new Replicate({
            auth: process.env.REPLICATE_API_TOKEN,
        });
        const output = await replicate.run(model, { input });
        return output
    } catch (error) {
        console.error(error);
    }
}
