import { NextResponse } from "next/server";
import { supabase } from "@utils";

/*
  @params : {
    cases : an array of distinct cases of which we need all the data of
  }
  @return : Array of data of the cases passed in
*/
export async function POST(req) {

  try {
    const body = await req.json();

    const cases = body.cases;

    const caseData = await Promise.all(
      cases.map(async (ca) => {
        const { data, error } = await supabase
          .from("judgements_sc")
          .select()
          .eq("case_no", ca)
          .limit(1)
          .single();

        if (error) {
          console.log(error);
          throw new Error(error.message);
        }

        return data;
      })
    );

    // console.log("Case data is: ", caseData);

    return NextResponse.json({ message: caseData }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failure" },
      { status: 400 }
    );
  }
}
