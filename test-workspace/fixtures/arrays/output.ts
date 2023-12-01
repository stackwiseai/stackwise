
stack(
  'brief',
  {
    'in': ['this \'\'\'is an example', 'this is an example', '{"test": "json to confuse the parser"}'],
  }
);  
  // TODO: allow the usage of in a string, but for now incentiviwe people to use in: ['this is an example', 'this is an example']
import getNullValue from '../../stacks/getNullValue';


await getNullValue();  
  // TODO: allow the usage of in a string, but for now incentiviwe people to use in: ['this is an example', 'this is an example']

/**
 * Brief: brief
 */
export default async function getNullValue(): Promise<any> {
    return new Promise((resolve, reject) => {
        resolve(null);
    });
}