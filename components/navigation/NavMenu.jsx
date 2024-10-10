'use client';
import { useState } from 'react'
import { Menu, X } from 'react-feather';
import { NavLinks } from '@constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavbarItem = ({ item, classProps }) => {

	// used this to change the styling for the active tab
	// gives the current segment of the url
  const pathname = usePathname();

	// checks whether the current segment is the link to be displayed
  const isActive = pathname === item.link;

  return(
		<li className={`mx-8 cursor-pointer ${classProps}`}>
			<Link className={isActive ? 'font-semibold underline underline-offset-2' : 'font-normal'} href={item.link}>{item.title}</Link>
		</li>
  )
}

const NavMenu = () => {

	// Sets the state for the mobile view menu drawer
  const [toggleMenu, setToggleMenu] = useState(false);

	// TODO: Will have to work on the mobile view menu drawer as on open, the text combines with the background and is not readable. Also will have to work on making it slide out on close the same way it slides in.
  return (
    <nav className='w-full flex md:justify-center justify-between items-center'>
			<ul className='text-white md:flex hidden list-none flex-row justify-between items-center flex-initial'>
				{NavLinks.map((item, index) => (
					<NavbarItem key={item + index} item={item}/>
				))}
			</ul>
			<div className='flex relative'>
				{!toggleMenu &&
					<Menu className="text-white md:hidden cursor-pointer w-8 h-8" onClick={() => setToggleMenu(true)} />
				}
				{toggleMenu &&(
					<ul
						className='z-10 fixed top-4 right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none flex flex-col justify-start items-end rounded-lg backdrop-blur-md text-white animate-slide-in'
					>
						<li className="text-2xl w-fill my-2">
							<X onClick={() => setToggleMenu(false)} /> 
						</li>
						{NavLinks.map((item, index) => (
							<NavbarItem key={item + index} item={item} classProps="my-2 text-lg"/>
						))}                        
					</ul>
				)}
			</div>
		</nav>
  )
}

export default NavMenu