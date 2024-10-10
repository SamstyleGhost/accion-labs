import { NextResponse } from "next/server";
// import OpenAIApi from 'openai';
import { supabase } from "@utils";  

export async function POST (req) {
  
  // const openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY});

  try {
    
    const body = await req.json();
    // console.log("Body is: ",body);

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: body.query     
      })
    })

    const embed = await response.json();
    const embedding = embed.data[0].embedding;
    // console.log("Embedding is: ",embedding);

    const { data, error } = await supabase.rpc('user_query_search', {
      query_embedding: embedding,
      similarity_threshold: 0.5,
      match_count: 3
    });

    
    if(error) {
      console.log(error);
      return NextResponse.json({ message: error }, { status: 500 });
    } 

    return NextResponse.json({ message: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
