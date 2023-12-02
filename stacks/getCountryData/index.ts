import axios from 'axios';

/**
 * Brief: get all countries in the world using restcountries.com
 */
export default async function getCountryData(): Promise<any> {
    try {
        const response = await axios.get('https://restcountries.com/v2/all');
        return response.data;
    } catch (error) {
        console.error(error);
    }
    return null;
}