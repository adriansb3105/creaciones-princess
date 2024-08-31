'use client'

import { pasteles } from '@/src/app/utils/hooks/pasteleria'
import Link from "next/link"

export default function Pasteleria() {
    return (
        <main>
            <h1 className="bg-[#ffe5ff] font-[Allura-Regular] text-center text-3xl md:text-2xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-bold text-[#94E8D5]">Pastelería</h1>

            <section className='bg-[#ffe5ff] h-min md:h-screen p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 lg:gap-6'>
            {
                pasteles.tortasFrias.tortas.map((torta) => {
                return (
                    <Link key={torta.id} href="" className="flex flex-col justify-center">
                        <h3 className='font-[Allura-Regular] text-[#1B7C7A] text-2xl md:text-xl lg:text-3xl xl:text-3xl 2xl:text-4xl'>{torta.name}</h3>

                        <img src={torta.url} className='aspect-video rounded-lg'alt={torta.name}/>
                    </Link>
                )})
            }
            </section>

            
        </main>
    )
}