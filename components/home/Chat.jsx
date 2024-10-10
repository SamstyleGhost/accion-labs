'use client';
import { useState } from 'react'
import Message from './chat/Message';
import IconButton from './chat/IconButton';
import { Spinner } from '@components';
import { useSectionContext } from '@context';

const Chat = () => {

  const { setSections } = useSectionContext();

  const [query, setQuery] = useState('');
  const [answer,  setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [sectionData, setSectionData] = useState([{}]);

  const [messages, setMessages] = useState([{
    sender: 'assistant',
    message: 'Hello! How may I help you today?'
  }]);

  // TODO: Will have to add a loading state animation while the messages are sent to the server and the assistant is loading the answer
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setMessages(prev => [...prev, { sender: 'user', message: query }])

    //  @param : contains the user query as the parameter 
    //  @output : Gives the max_limit number of similar sections
    const searchResponse = await fetch('/api/search',{
      method: 'POST',
      body: JSON.stringify({
        query: query
      }),
      'content-type': 'application/json'
    });

    const results = await searchResponse.json();

    console.log("Results are: ",results);
    setSections(results.message);

    let sections = [];

    await results.message.map(section => {
      const dataObject = {
        act_number: section.act_number,
        document_name: section.document_name,
        section_title: section.section_title,
        section_text: section.section_text
      };

      sections.push(dataObject);
    });

    const answerResponse = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        query: query,
        sections: sections
      }),
      'content-type': 'application/json'
    })

    if(!answerResponse) {
      setLoading(false);
      return;
    }

    // console.log("Answer response: ", answerResponse);
    const queryAnswer = await answerResponse.json();

    setAnswer(queryAnswer.message);

    // if(!data) {
    //   setLoading(false);
    //   return;
    // }

    // const reader = data.getReader();
    // const decoder = new TextDecoder();
    // let done = false;

    // while(!done) {
    //   console.log("Inside while");
    //   const { value, doneReading } = await reader.read();
    //   done = doneReading;

    //   const chunkValue = decoder.decode(value);
    //   setAnswer(prev => prev + chunkValue);
    // }
    setMessages(prev => [...prev, { sender: 'assistant', message: queryAnswer.message }]);

    // * From that result texts, from MongoDB, get legal ontology information used in those sections
    // Append that and give it to the ChatGPT prompt
    // ChatGPT response will be given back as res.json

    setQuery('');
    setLoading(false);
  }

  return (
    <div className='w-full flex flex-col flex-grow-1 justify-between self-end'>
      <div className='w-full chat-height flex flex-col gap-4 overflow-y-auto'>
        {messages.map((message, index) => <Message key={index} sender={message.sender} message={message.message}/>)}
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