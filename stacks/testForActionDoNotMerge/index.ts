import axios from 'axios';

/**
 * Brief: Create a random user using the random.me api
 */
export default async function createRandomUser(): Promise<any> {
    try {
        const response = await axios.get('https://randomuser.me/api/');
        return response.data.results[0];
    } catch (error) {
        console.error(error);
    }
}