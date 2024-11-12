'use client';
import Markdown from "react-markdown";

const Message = ({ sender, message }) => {

  return (
    <div className={`w-3/4 lg:w-2/3 rounded-md px-4 py-2 leading-tight ${sender === 'user' ? 'self-end bg-primary' : 'self-start bg-secondary'}`}>
      {sender === 'user' ? <span>{message}</span> : <Markdown>{message}</Markdown>}
    </div>
  )
}

export default Message
