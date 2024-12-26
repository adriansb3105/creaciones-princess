/*'use client'

import Link from 'next/link'
import { useState } from 'react'

export const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false)

    function getMenuClasses() {
        let menuClasses = []

        if(isOpen) {
            menuClasses = [
                'flex',
                'absolute',
                'top-[100px]',
                'bg-gray-800',
                'w-full',
                'p-4',
                'left-0',
                'gap-10',
                'flex-col',
                'z-10'
            ]
        } else {
            menuClasses = ['hidden', 'md:flex']
        }

        return menuClasses.join(' ')
    }

    return (
        <nav className='bg-[#fad5fa] text-[#dc95d4] p-4 sm:p-6 md:flex md:justify-between md:items-center'>
            <div className='container mx-auto flex justify-between items-center'>
                <Link href='/' className={`flex items-center gap-2 text-5xl font-bold`}>
                    <img src="/img/logo.png" alt="Creaciones Princess" className='w-20'/>
                    Creaciones Princess
                </Link>
                <div className={getMenuClasses()}>
                    <Link href='/' className='mx-2 hover:text-gray-300 font-bold text-2xl'>
                        Principal
                    </Link>
                    
                    <Link href='/acerca' className='mx-2 hover:text-gray-300 font-bold text-2xl'>
                        Acerca de
                    </Link>
                    
                    <Link href='/contacto' className='mx-2 hover:text-gray-300 font-bold text-2xl'>
                        Contacto
                    </Link>
                </div>

                <div className='md:hidden flex items-center'>
                    <button onClick={()=> {
                        setIsOpen(!isOpen)
                    }}>

                        <svg
                            className='w-6 h-6'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                        >

                            {isOpen? (
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M6 18L18 6M6 6l12 12'
                                ></path>
                            ) : (
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M4 6h16M4 12h16m-7 6h7'
                                ></path>
                            )}
                        </svg>

                    </button>
                </div>
            </div>
        </nav>
    )
}*/

'use client'

import { useState } from 'react'
//import { Playfair_Display, Lato } from 'next/font/google'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

//const playfair = Playfair_Display({ subsets: ['latin'] })
//const lato = Lato({ weight: ['400', '700'], subsets: ['latin'] })

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <header className="bg-pink-50 shadow-md">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        
        <Link id='inicio' href='/' className={`flex items-center gap-2 text-5xl font-bold text-[#dc95d4]`}>
          <img src="/img/logo.png" alt="Creaciones Princess" className='w-20'/>
            Creaciones Princess
        </Link>

        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li><a href="#products" className="fancy-underline text-xl text-[#dc95d4] hover:text-pink-600 transition-colors">Productos</a></li>
            <li><a href="#whoweare" className="fancy-underline text-xl text-[#dc95d4] hover:text-pink-600 transition-colors">Sobre Nosotros</a></li>
            <li><a href="#contact" className="fancy-underline text-xl text-[#dc95d4] hover:text-pink-600 transition-colors">Contacto</a></li>
          </ul>
        </nav>
        <button className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <X className="h-6 w-6 text-[#dc95d4]" /> : <Menu className="h-6 w-6 text-[#dc95d4]" />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <nav className="bg-white px-4 pt-2 pb-4 shadow-lg">
            <ul className="space-y-2">
              <li><a href="#products" className="block py-2 text-xl text-[#dc95d4] hover:text-pink-600 transition-colors" onClick={toggleMenu}>Productos</a></li>
              <li><a href="#whoweare" className="block py-2 text-xl text-[#dc95d4] hover:text-pink-600 transition-colors" onClick={toggleMenu}>Sobre Nosotros</a></li>
              <li><a href="#contact" className="block py-2 text-xl text-[#dc95d4] hover:text-pink-600 transition-colors" onClick={toggleMenu}>Contacto</a></li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}

