
/**
 * Brief: Delete voice from voice library in elevenlabs
 */

export default async function deleteVoiceFromVoiceLab({id}:{id:string}): Promise<any> {
    try {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        const options:RequestInit = {method: 'DELETE', headers: [['xi-api-key',String(apiKey)]]};
       const response = await fetch(`https://api.elevenlabs.io/v1/voices/${id}`, options)
       return response.json()
    } catch (error) {
        console.error(error);
    }
}
