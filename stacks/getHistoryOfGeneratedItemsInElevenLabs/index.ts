
/**
 * Brief: Get all generated audio in elevenlabs
 */

export default async function getGeneratedAudio(): Promise<any> {
    try {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        const options:RequestInit = {method: 'GET', headers: [['xi-api-key',String(apiKey)]]};

       const response = await fetch('https://api.elevenlabs.io/v1/history', options)
       return response.json()
    } catch (error) {
        console.error(error);
    }
}
