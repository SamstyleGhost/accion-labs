import { NextResponse } from "next/server";
import { pipeline } from "@xenova/transformers";
import { supabase } from "@utils";

// There is a question-answering model as well, can see if that works https://huggingface.co/docs/transformers.js/main/en/api/pipelines#pipelinesquestionansweringpipeline

export async function POST(req) {
  const pipe = await pipeline("feature-extraction", "Xenova/gte-large")

  try {
    const body = await req.json();
    const response = await pipe(body.query, { pooling: 'mean', normalize: true })
    const embedding = Array.from(response.data)

    // console.log("Response for the embeddings is: ", embedding);

    const { data, error } = await supabase.rpc('case_query_search', {
      query_embedding: embedding,
      similarity_threshold: 0.85,
      match_count: 3
    })

    if (error) {
      console.log(error);
      return NextResponse.json({ message: error }, { status: 500 });
    }

    const cases = new Set()
    const similarities = [];

    data.map((item) => {
      cases.add(item.case_no);
    })

    data.map(item => {
      similarities.push(item.similarity);
    })

    const casesData = Array.from(cases)

    return NextResponse.json({ message: casesData, similarities: similarities }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Failure" }, { status: 400 })
  }

}
