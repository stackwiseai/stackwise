import { subscribeEmail } from '../actions';
import { SubmitButton } from './input-with-button';
import { Form } from './input-with-button';
import { useFormState } from 'react-dom';

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
            className="text-blue-400 font-medium"
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
                className="rounded-full w-full py-2 pl-4 pr-10 border border-gray-400 focus:outline-none focus:shadow-outline"
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
