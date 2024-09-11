'use client'

import { pasteles } from '@/src/app/utils/hooks/pasteleria'
import Link from "next/link"
import Image from 'next/image'

export default function Pasteleria() {
    //const images = await getImages()
    //console.log(images);
    
    return (
    <main className="px-10 py-4 bg-[#ffe5ff]">
      <h2 className="bg-[#ffe5ff] text-center text-3xl md:text-2xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-bold text-[#94E8D5] py-1">Pastelería</h2>
      
      <h2 className="bg-[#ffe5ff] text-3xl md:text-2xl lg:text-4xl xl:text-4xl 2xl:text-5xl text-[#94E8D5] py-1">Tortas Frías</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pasteles.tortasFrias.tortas.map((torta) => (
          <div key={torta.id} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
            <Image
              src={torta.url}
              alt={torta.name}
              sizes='10vh'
              width={150}
              height={100}
            />

            <div className="h-full flex-grow flex flex-col justify-evenly">
              <h3 className='text-[#1B7C7A] text-2xl md:text-xl lg:text-3xl xl:text-3xl 2xl:text-4xl font-bold'>{torta.name}</h3>

              <p className="text-2xl text-gray-600">{torta.description}</p>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold">₡ {torta.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
    )
}
/*
export async function getImages() {
    const results = await fetch(`https://api.cloudinary.com/v1_1/adriansb3105/resources/image`, {
        mode: 'no-cors',
        cache: 'force-cache',
        headers: {
            Authorization: `Basic ${Buffer.from('314278813578557' + ':' + 'TZJQ4zvPzyOh_VKQr4RZOFH8bEs').toString('base64')}`,
        }
    }).then(r => r.json())

    const { resources } = results

    const images  = resources.map(resource => {
        const { width, height } = resource
        return {
            id: resource.asset_id,
            title: resource.public_id,
            image: resource.secure_url,
            width,
            height
        }
    })

    return {
        images
    }
}
    */