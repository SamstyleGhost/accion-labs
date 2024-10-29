import { Gitlab } from 'react-feather';
import NavMenu from './NavMenu'

const NavBar = () => {
  return (
    <div className='flex justify-between items-center'>
      <div className='flex items-center gap-4 md:gap-8'>
        <Gitlab className='w-12 h-12 md:w-14 md:h-14'/>
        <span className='font-semibold text-2xl md:text-3xl'>Legal Case Search</span>
      </div>
      <div>
        <NavMenu />
      </div>
    </div>
  )
}

export default NavBar