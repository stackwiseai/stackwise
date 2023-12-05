
/**
 * Brief: Get Audio From History Item in elevenlabs
 */

export default async function getAudioInHistory({id}:{id:string}): Promise<any> {
    try {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        const options:RequestInit = {method: 'GET', headers: [['xi-api-key',String(apiKey)]]};
       const response = await fetch(`https://api.elevenlabs.io/v1/history/${id}/audio`, options)
       return response.body
    } catch (error) {
        console.error(error);
    }
}
