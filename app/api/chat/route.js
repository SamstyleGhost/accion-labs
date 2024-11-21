import { getGroqChatStream, LlamaStream } from "@utils";
import { NextResponse } from "next/server";

export async function POST(req) {

  const body = await req.json();

  try {
    const groqStream = await getGroqChatStream({ query: body.query, context: body.context, model: body.model });
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
