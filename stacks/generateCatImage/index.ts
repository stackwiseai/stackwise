import axios from 'axios';

/**
 * Brief: Generate the image of a cat
 */
export default async function generateCatImage(input: null): Promise<string> {
    const response = await axios.get('https://api.thecatapi.com/v1/images/search');
    return response.data[0].url;
}