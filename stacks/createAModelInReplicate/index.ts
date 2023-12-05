
import axios from 'axios';
/**
 * Brief: Create a model in replicate
 */

interface modelInterface {
    data: {
        owner: string,
        name: string,
        description?: string,
        visibility: string,
        hardware: string
    }
}
export default async function createNewPrediction({ data }: modelInterface): Promise<any> {
    try {
        const config = {
            headers: {
                'Authorization': 'Token r8_NjJI0tpo0pG1EkO8xJ9KEmrwYd5U2vB45cmmj',
                'Content-Type': 'application/json'
            }
        };
        const response = await axios.post('https://api.replicate.com/v1/models', data, config)
        return response.data
    } catch (error) {
        console.error(error);
    }
}