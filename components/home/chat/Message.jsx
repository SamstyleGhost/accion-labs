'use client';

const Message = ({ sender, message }) => {

  return (
    <div className={`w-3/4 lg:w-2/3 rounded-md px-4 py-2 leading-tight ${sender === 'user' ? 'self-end bg-primary' : 'self-start bg-secondary'}`}>
      {message}
    </div>
  )
}

export default Message