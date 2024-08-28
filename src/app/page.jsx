// import Image from "next/image";

import Link from "next/link"

const items = [
  {
    name: 'Agendas',
    link: 'agendas',
    image: 'agendas.jpg',
    cover: 'cover'
  },
  {
    name: 'Artesanías',
    link: 'artesanias',
    image: 'artesanias.jpg',
    cover: 'cover'
  },
  {
    name: 'Decoraciones y Eventos',
    link: 'eventos',
    image: 'eventos.jpg',
    cover: 'cover'
  },
  {
    name: 'Pastelería',
    link: 'pasteleria',
    image: 'pasteleria.jpg',
    cover: 'contain'
  },
  {
    name: 'Repostería',
    link: 'reposteria',
    image: 'reposteria.png',
    cover: 'cover'
  },
  {
    name: 'Scrapbook',
    link: 'scrapbook',
    image: 'scrapbook.jpg',
    cover: 'cover'
  }
]

export default function Home() {

  return (
    <section className='bg-[#ffe5ff] h-min md:h-screen p-10 sm:p-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 lg:gap-6'>
      {
        items?.map((item) => {
          return (
          <Link key={item.link} href={item.link} className={`font-[Allura-Regular] font-bold bg-[url('/img/${item.image}')] bg-${item.cover} aspect-video text-white flex items-center justify-center text-center text-3xl lg:text-4xl md:text-2xl xl:text-4xl 2xl:text-5xl py-4 rounded-lg`}>
            {item.name}
          </Link>
        )})
      }
    </section>
  );
}
