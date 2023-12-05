
/**
 * Brief: get specific voice metadata using voice id in elevenlabs
 */

export default async function getSpecificVoiceByID({id}:{id:string}): Promise<any> {
    try {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        const options:RequestInit = {method: 'GET', headers: [['xi-api-key',String(apiKey)]]};
       const response = await fetch(`https://api.elevenlabs.io/v1/voices/${id}`, options)
       return response.json()
    } catch (error) {
        console.error(error);
    }
}
