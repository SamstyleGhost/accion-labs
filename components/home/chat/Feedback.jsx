"use client"
import { useState } from "react";
import { Check, X  } from "react-feather";

const Feedback = ({ messageID }) => {
  
  const [responded, setResponded] = useState(false);
  
  const handleSubmit = async (feedback) => {

    const feedbackResponse = await fetch('/api/feedback/user', {
      method: 'POST',
      body: JSON.stringify({
        acceptance: feedback,
        messageID: messageID
      }),
      'content-type': 'application/json'
    })

    const feedbackResponseJSON = feedbackResponse.json();
    setResponded(true);
  }
  
  return (
    <div className="w-full flex flex-col items-center border-t border-white pt-4">
      <p>Do you feel the response given was correct?</p>
      <div className="flex w-1/2 justify-center gap-8 pt-2">
        {responded ? (
          <p className="italic text-sm">Thank you for your feedback!!</p>
        ) : (
          <>
            <Check
              className="hover:scale-125 cursor-pointer"
              onClick={() => handleSubmit(true)}
            />
            <X 
              className="hover:scale-125 cursor-pointer"
              onClick={() => handleSubmit(false)}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Feedback;