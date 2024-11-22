import { createClient } from '@supabase/supabase-js';
import ollama from 'ollama'
import Groq from 'groq-sdk';

export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const groq = new Groq({ api_key: process.env.GROQ_API_KEY });

export async function* LlamaStream({ query, context }) {
  console.log("Query is: ", query)
  console.log("Context is: ", context)

  const jsonFormat = {
    case_no: "Case number",
    diary_no: "Diary number",
    judgement_type: "",
    petitioner: "This will have the petitioner's name",
    respondent: "This will have the respondent's name",
    petitioner_advocate: "This will have the petitioner's advocate's name",
    respondent_advocate: "This will have the respondent's advocate's name",
    bench: "Name of the judges on the bench",
    judge: "Name of the chief judge",
    judgement_date: "Date of the judgement",
    document_link: "Link of the document for the case",
    summary: "Summary of the document",
  }

  const contextData = JSON.stringify(context);
  const formatString = JSON.stringify(jsonFormat);

  const prompt = `You are a legal assistant that lets the users know the petitioner, respondent, case number, advocates, the bench & judgements of cases that have happened previously. You will be given the cases here in a stringified JSON format:
    ${contextData}.
    Explain these cases in detail. If there are more than one, explain each one of them individually and what were the differences in them. It is crucial that you mention all the stakeholders, i.e. the petitioners, case number, respondents, te advocates, the judges. Even if the user asks for any advice, first explain these cases and only after that should you refer them for an advice. Do not use data outside of the context given to you here. If the context given to you is undefined, reply that you do not know of any particular cases that match this scenario.
  `;
  // const prompt = `Summarise this: ${contextData}. Mention all stakeholders`
  console.log("Propmt is: ", prompt);

  // Respond in detail. Remind people to consult lawyers. If the query does not seem to be a legal query, deny a response.
  try {
    const response = await ollama.chat({
      model: "qwen:1.8b",
      messages: [
        {
          role: "system",
          content: prompt
        }, {
          role: "user",
          content: "Who is the petitioner, the bench & the respondent?",
        },
      ],
      stream: true,
      max_tokens: 800
    })

    for await (const chunk of response) {
      yield chunk;
    }
  } catch (error) {
    console.error(error);
  }
}

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

    // for await (const chunk of response) {
    //   yield chunk;
    // }
    return response;
  } catch (error) {
    console.error(error);
  }
}