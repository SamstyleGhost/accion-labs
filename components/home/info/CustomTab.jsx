import { ArrowRight } from 'react-feather';

const CustomTab = ({ data, url }) => {

  const hyperlink = `https://api.sci.gov.in/${url}`

  return (
    <a href={hyperlink} className='w-3/4 bg-accent rounded-lg px-4 py-2 flex justify-between cursor-pointer' target='_blank'>
      <span className='truncate w-4/5'>{data}</span>
      <ArrowRight />
    </a>
  )
}

export default CustomTab
