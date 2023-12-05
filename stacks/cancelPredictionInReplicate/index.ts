
import axios from 'axios';
/**
 * Brief: Cancel a predicition in replicate
 */

type predictionType = {
    id: string

}
export default async function cancelPrediction({ id }: predictionType): Promise<any> {
    try {

        const config = {
            headers: {
                'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };
        const response = await axios.post(`https://api.replicate.com/v1/predictions/${id}/cancel`, null, config);
        return response.data
    } catch (error) {
        console.error(error);
    }
}