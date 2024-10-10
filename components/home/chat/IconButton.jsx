'use client'

import { Mic, Send } from 'react-feather'

const IconButton = ({ icon }) => {
  return (
    <button type='submit' className='cursor-pointer'>
      {icon === 'send' ? <Send /> : <Mic />}
    </button>
  )
}

export default IconButton