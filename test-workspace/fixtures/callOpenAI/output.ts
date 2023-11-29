
const question = 'what is the meaning of life?';

stack('answer my  question using OpenAI', {in: question, out: '42'});

import answerQuestionUsingOpenAI from '../../stacks/answerQuestionUsingOpenAI';


const question = 'what is the meaning of life?';

await answerQuestionUsingOpenAI('question');


import axios from 'axios';

/**
 * Brief: answer my  question using OpenAI
 */
export default async function answerQuestionUsingOpenAI(input: string): Promise<string> {
    const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
        prompt: input,
        max_tokens: 60
    }, {
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
    });

    return response.data.choices[0].text.trim();
}