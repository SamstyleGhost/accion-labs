import { NextResponse } from "next/server";
import { supabase } from "@utils";

/*
  @params: 
    acceptance: User feedback
    messageID: the messageID to update
  */
export async function POST(req) {

  try {

    const body = await req.json();
    console.log("Body is: ",body);
    
    const { data, error } = await supabase
      .from("testing")
      .update([
        {
          acceptance: body.acceptance
        },
      ]).eq('message_id', body.messageID)
      .select();
        
    
    console.log("Data: ",data);
    console.log("Details: ",error.details);
    console.log("Hint: ",error.hint);
    console.log("Code: ",error.code);
    console.log("Message: ", error.message)
    if(error) {
      console.error(error);
      return NextResponse.json({ message: error.message }, { status: error.code });
    }

    return NextResponse.json({ message: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}