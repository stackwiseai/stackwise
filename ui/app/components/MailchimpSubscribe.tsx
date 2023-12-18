import { useFormState } from 'react-dom';

import { subscribeEmail } from '../actions';
import { Form, SubmitButton } from './input-with-button';

const MailchimpSubscribe = () => {
  const [outputState, functionAction] = useFormState(subscribeEmail, {
    status: '',
  });
  return (
    <>
      {outputState.status === 'success' ? (
        <div className="text-center text-green-500">
          Thanks for subscribing! Join our{' '}
          <a
            className="font-medium text-blue-400"
            href="https://discord.gg/KfUxa8h3s6"
          >
            Discord
          </a>
        </div>
      ) : (
        <>
          <Form action={functionAction}>
            <div className="relative w-full sm:w-3/4">
              <input
                placeholder="Enter your email"
                type="email"
                name="email"
                className="focus:shadow-outline w-full rounded-full border border-gray-400 py-2 pl-4 pr-10 focus:outline-none"
                required
              />
              <SubmitButton />
            </div>
          </Form>
          {outputState.status === 'error' && <div>error.title</div>}
        </>
      )}
    </>
  );
};

export default MailchimpSubscribe;
