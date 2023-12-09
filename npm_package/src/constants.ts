import OpenAI from 'openai';

export const placeholderName = 'placeholderName';

const defaultHeaders = process.env.HELICONE_API_KEY
  ? {
      'Helicone-Auth': `Bearer ${process.env.HELICONE_API_KEY}`,
      'Helicone-Cache-Enabled': 'true',
    }
  : {};

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://oai.hconeai.com/v1',
  defaultHeaders: defaultHeaders,
});
