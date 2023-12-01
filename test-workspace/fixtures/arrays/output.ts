
stack(
  'brief',
  {
    'in': ['this \'\'\'is an example', 'this is an example', '{"test": "json to confuse the parser"}'],
  }
);  
  // TODO: allow the usage of in a string, but for now incentiviwe people to use in: ['this is an example', 'this is an example']
import nullifyInput from '../../stacks/nullifyInput';


await nullifyInput(['this \'\'\'is an example', 'this is an example', '{"test": "json to confuse the parser"}']);  
  // TODO: allow the usage of in a string, but for now incentiviwe people to use in: ['this is an example', 'this is an example']

/**
 * Brief: brief
 */
export default async function nullifyInput(input: undefined): Promise<null> {
    if(input === undefined) {
        return null;
    } else {
        throw new Error("Input must be undefined");
    }
}