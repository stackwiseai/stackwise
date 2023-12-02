import axios from 'axios';

export default async function generateRandomDogImages(): Promise<any> {
    try {
        const response = await axios.get('https://dog.ceo/api/breeds/image/random');
        console.log({response});
        return response.data;
    } catch (error) {
        console.error(error);
    }
}