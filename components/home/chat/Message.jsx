'use client';
import { Feedback } from "@components";
import Markdown from "react-markdown";

const AssistantMessage = ({ message, messageID, feedback }) => {

  return (
    <div className="flex flex-col gap-4">
      <Markdown>{message}</Markdown>
      {feedback && <Feedback messageID={messageID} />}
    </div>
  )
}

const Message = ({ sender, message, messageID, feedback = false }) => {

  return (
    <div className={`w-3/4 lg:w-2/3 rounded-md px-4 py-2 leading-tight ${sender === 'user' ? 'self-end bg-primary' : 'self-start bg-secondary'}`}>
      {sender === 'user' ? <span>{message}</span> : <AssistantMessage message={message} messageID={messageID} feedback={feedback} />}
    </div>
  )
}

export default Message
