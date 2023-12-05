
import axios from 'axios';
/**
 * Brief: get all list of predictions made in replicate
 */

export default async function getAllPrediction(): Promise<any> {
    try {
        
        const config = {
            headers: {
                'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };
        const response = await axios.get('https://api.replicate.com/v1/predictions', config);
        return response.data
    } catch (error) {
        console.error(error);
    }
}