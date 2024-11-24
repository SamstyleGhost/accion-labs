import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const groq = new Groq({ api_key: process.env.GROQ_API_KEY });

export async function getGroqChatStream({ query, context, model }) {

  const contextData = JSON.stringify(context);

  const prompt = `You are a legal assistant that lets the users know the petitioner, respondent, case number, advocates, the bench & judgements of cases that have happened previously. You will be given the cases here in a stringified JSON format:
    ${contextData}.
    Explain these cases in detail. If there are more than one, explain each one of them individually and what were the differences in them. It is crucial that you mention all the stakeholders, i.e. the petitioners, case number, respondents, te advocates, the judges. Even if the user asks for any advice, first explain these cases and only after that should you refer them for an advice. Do not use data outside of the context given to you here. If the context given to you is undefined, reply that you do not know of any particular cases that match this scenario.
    If the data provided to you is empty, then reply with you do not know about any previous cases.
  `;

  try {

    const response = groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: query,
        },
      ],
      model: model,
      temperature: 0.2,
      max_tokens: 1024,
      top_p: 1,
      stop: null,
      stream: false,
    });

    return response;
  } catch (error) {
    console.error(error);
  }
}
