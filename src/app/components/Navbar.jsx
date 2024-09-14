'use client'

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
}