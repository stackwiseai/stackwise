import axios from 'axios';

export default async function generateAnimateQuote(): Promise<any> {
    try {
        const response = await axios.get('https://animechan.xyz/api/random');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}