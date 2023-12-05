
import axios from 'axios';
/**
 * Brief: Create a new predicition in replicate
 */

interface predictionModel {
    data: {
        version: string,
        input: {
            text: string
        }
    }
}
export default async function createNewPrediction({ data }: predictionModel): Promise<any> {
    try {
        
        const config = {
            headers: {
                'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };
        const response = await axios.post('https://api.replicate.com/v1/predictions', data, config);
        return response
    } catch (error) {
        console.error(error);
    }
}