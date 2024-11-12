import { getGroqChatStream, LlamaStream } from "@utils";
import { NextResponse } from "next/server";

export async function POST(req) {

  const body = await req.json();

  try {
    // const stream = await LlamaStream({ query: body.query, context: body.context });
    // const stream = new ReadableStream({
    //   async start(controller) {
    //     // const llamaStream = await LlamaStream({ query: body.query, context: body.context });
    //     const groqStream = await getGroqChatStream({ query: body.query, context: body.context });
    //     // for await (const chunk of groqStream) {
    //     //   
    //     //   controller.enqueue(chunk.choices[0]?.delta?.content);
    //     // }
    //     // controller.close();
    //
    //   }
    const groqStream = await getGroqChatStream({ query: body.query, context: body.context });
    return NextResponse.json({ message: groqStream.choices[0]?.delta?.content }, { status: 200 });
    // })

    // return new NextResponse(stream, {
    //   headers: {
    //     "Content-Type": "text/event-stream",
    //     "Cache-Control": "no-cache",
    //     Connection: "keep-alive",
    //   }
    // })
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
