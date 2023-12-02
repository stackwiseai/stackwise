import axios from 'axios';

/**
 * Brief: Get the book's data
 */
export default async function getBookData(input: string): Promise<any> {
    try {
        const response = await axios.get(`https://api.example.com/books/${input}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}