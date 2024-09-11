// import Image from "next/image";

import Link from "next/link"

const items = [
  {
    name: 'Agendas',
    link: 'agendas',
    image: 'agendas.jpg'
  },
  {
    name: 'Artesanías',
    link: 'artesanias',
    image: 'artesanias.jpg'
  },
  {
    name: 'Decoraciones y Eventos',
    link: 'eventos',
    image: 'eventos.jpg'
  },
  {
    name: 'Pastelería',
    link: 'pasteleria',
    image: 'pasteleria.jpg'
  },
  {
    name: 'Repostería',
    link: 'reposteria',
    image: 'reposteria.png'
  },
  {
    name: 'Scrapbook',
    link: 'scrapbook',
    image: 'scrapbook.jpg'
  }
]


export default function Home() {
  return (
    <section className='bg-[#ffe5ff] h-min md:h-screen p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 lg:gap-6'>
      {
        items?.map((item) => {
          return (
            <Link key={item.link} href={item.link} className="relative">
              <img src={`/img/${item.image}`} className='aspect-video rounded-lg'/>

              <div className='w-full h-full top-0 left-0 absolute flex justify-center items-center flex-col'>
                <h1 className='font-[Allura-Regular] font-bold text-white text-3xl md:text-2xl lg:text-4xl xl:text-4xl 2xl:text-5xl'>{item.name}</h1>
              </div>
            </Link>
        )})
      }
    </section>
  );
}
