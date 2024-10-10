'use client';
import { useSectionContext } from '@context'
import CustomTab from './info/CustomTab'
import IssueFeedback from './info/IssueFeedback'
import Social from './info/Social'

const InfoTab = () => {

  const { sections } = useSectionContext();
  
  sections.map((section) => {
    console.log(section.section_title);
  })

  return (
    <div className='w-full md:w-1/4 mt-8 md:mt-0 flex flex-col gap-8 justify-between items-center md:items-start'>
      <div className='w-full flex flex-col gap-8'>
        <div className='w-full md:w-3/4 flex justify-center'>
          <span>Info Tab</span>
        </div>
        <div className='flex flex-col gap-4 w-full justify-between items-center md:items-start truncate'>

          {sections && sections.map((section, index) => {
            return <CustomTab data={section.section_title} url={section.section_url} key={index} />
          })}
        </div>
        <hr className="my-2 w-full md:w-3/4"/>
      </div>
      <div className='flex flex-col gap-8'>
        <div>
          <IssueFeedback />
        </div>
        <Social />
      </div>
    </div>
  )
}

export default InfoTab