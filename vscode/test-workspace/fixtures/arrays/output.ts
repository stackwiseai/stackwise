
stack(
  'brief',
  {
    'in': ['this \'\'\'is an example', 'this is an example', '{"test": "json to confuse the parser"}'],
  }
);  
  // TODO: allow the usage of in a string, but for now incentiviwe people to use in: ['this is an example', 'this is an example']
import getBriefData from '../../stacks/getBriefData';


await getBriefData();  
  // TODO: allow the usage of in a string, but for now incentiviwe people to use in: ['this is an example', 'this is an example']

import axios from 'axios';

/**
 * Brief: brief
 */
export default async function getBriefData(): Promise<any> {
    try {
        const response = await axios.get('https://api.example.com/briefdata');
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}