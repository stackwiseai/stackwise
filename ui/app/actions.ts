'use server';

const MAILCHIMP_URL =
  'https://us17.api.mailchimp.com/3.0/lists/77b1abf780/members/';
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;

export const subscribeEmail = async (prevState, formData) => {
  console.log(prevState, formData);
  const email = formData.get('email') as string;

  const data = {
    email_address: email,
    status: 'subscribed', // or 'pending' for double opt-in
  };

  try {
    const response = await fetch(MAILCHIMP_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`anystring:${MAILCHIMP_API_KEY}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      console.log('Subscription successful');
      return { status: 'success' };
    } else {
      const errorData = await response.json();
      console.error('Subscription error:', errorData);
      return { status: 'error', error: errorData };
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// import { stack } from 'stackwise';

export const callStack = async (prevState: any, formData: FormData) => {
  const userRequest = formData.get('stack') as string;
  // const message = await stack(userRequest);
  const message = 'remove';

  return message;
};

export const parseFormData = async (prevState: any, formData: FormData) => {
  const num1 = Number(formData.get('num1'));
  const num2 = Number(formData.get('num2'));

  return await multiplyNumbers(num1, num2);
};

/**
 * Brief: Multiply two numbers together
 */
async function multiplyNumbers(num1: number, num2: number): Promise<number> {
  return num1 * num2;
}
