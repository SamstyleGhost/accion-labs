'use client';
import { useState } from 'react'
import Message from './chat/Message';
import IconButton from './chat/IconButton';
import { Spinner } from '@components';
import { useSectionContext } from '@context';

const Chat = () => {

  const { setSections } = useSectionContext();

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([{
    sender: 'assistant',
    message: 'Hello! How may I help you today?'
  }]);

  // TODO: Will have to add a loading state animation while the messages are sent to the server and the assistant is loading the answer
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setMessages(prev => [...prev, { sender: 'user', message: query }])
    // setMessages((prev) => [...prev, { sender: "assistant", message: "..." }]);

    const searchResponse = await fetch('/api/embeddings', {
      method: 'POST',
      body: JSON.stringify({
        query: query
      }),
      'content-type': 'application/json'
    });

    let response = await searchResponse.json();
    console.log("Search response is: ", response);

    const caseDataResponse = await fetch('/api/case-data', {
      method: 'POST',
      body: JSON.stringify({
        cases: response.message
      }),
      'content-type': 'application/json'
    })

    response = await caseDataResponse.json()
    setSections(response.message);
    console.log("Case Data response is: ", response);

    const answerResponse = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        query: query,
        context: response.message
      }),
      'content-type': 'application/json',
    })

    response = await answerResponse.json()
    console.log(response.message)
    setMessages(prev => [...prev, { sender: "assistant", message: response.message }])

    // const reader = answerResponse.body.getReader();
    // const decoder = new TextDecoder("utf-8");
    //
    // let done = false;
    // let answer = "";
    // while (!done) {
    //   const { value, done: streamDone } = await reader.read();
    //   done = streamDone;
    //   answer += decoder.decode(value, { stream: true })
    //   setMessages(prev => [
    //     ...prev.slice(0, -1),
    //     { sender: "assistant", message: answer }
    //   ])
    // }

    setQuery('');
    setLoading(false);
  }

  return (
    <div className='w-full flex flex-col flex-grow-1 justify-between self-end'>
      <div className='w-full chat-height flex flex-col gap-4 overflow-y-auto'>
        {messages.map((message, index) => <Message key={index} sender={message.sender} message={message.message} />)}
      </div>
      <div className='w-full mt-4'>
        <form onSubmit={handleSubmit} className='bg-secondary p-2 rounded-lg flex justify-center'>
          <textarea
            type='text'
            placeholder='Enter your query here...'
            value={query}
            className='w-full h-20 bg-primary border-2 border-transparent p-2 outline-0 focus:border-accent rounded-lg resize-none'
            disabled={loading}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className='flex items-center mx-4 gap-8'>
            {loading
              ? <Spinner />
              : <IconButton
                icon='send'
              />}

          </div>
        </form>
      </div>
    </div>
  )
}

export default Chat
