import { getGroqChatStream, LlamaStream } from "@utils";
import { NextResponse } from "next/server";

export async function POST(req) {

  const body = await req.json();
  const model = "llama3-8b-8192";

  try {
    const groqStream = await getGroqChatStream({ query: body.query, context: body.context, model: model });
    console.log("Groq response is: ", groqStream);
    return NextResponse.json({ message: groqStream.choices[0]?.message?.content }, { status: 200 });
    // })

    // return new NextResponse(stream, {
    //   headers: {
    //     "Content-Type": "text/event-stream",
    //     "Cache-Control": "no-cache",
    //     Connection: "keep-alive",
    //   }
    // })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
