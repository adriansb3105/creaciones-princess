// import Image from "next/image";

import Link from "next/link"

export default function Home() {

  return (
    /*<main className={styles.main}>*/
    /*<Image className={styles.logo} src="/next.svg" alt="Next.js Logo" width={180} height={37} priority />*/
    
    /**
     <div className='bg-[#ffe5ff] h-min md:h-screen p-10 sm:p-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 sm:grid-rows-5 md:grid-rows-4 gap-3 lg:gap-6'>
      <div className='bg-blue-500 text-white text-center text-5xl py-4 rounded-lg row-span-2 md:row-span-4'>1</div>
      <div className='bg-blue-500 text-white text-center text-5xl py-4 rounded-lg sm:col-span-2 md:col-span-3'>2</div>
      <div className='bg-blue-500 text-white text-center text-5xl py-4 rounded-lg'>3</div>
      <div className='bg-blue-500 text-white text-center text-5xl py-4 rounded-lg'>4</div>
      <div className='bg-blue-500 text-white text-center text-5xl py-4 rounded-lg md:row-span-2'>5</div>
      <div className='bg-blue-500 text-white text-center text-5xl py-4 rounded-lg'>6</div>
      <div className='bg-blue-500 text-white text-center text-5xl py-4 rounded-lg'>7</div>
      <div className='bg-blue-500 text-white text-center text-5xl py-4 rounded-lg col-span-2 sm:col-span-3'>8</div>
     </div>
     */

    <div className='bg-[#ffe5ff] h-min md:h-screen p-10 sm:p-16 grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-6'>
      <Link href="/agendas" className={`bg-[url('/img/agendas.jpg')] bg-cover text-white flex items-center justify-center text-center text-base md:text-lg lg:text-2xl xl:text-3xl 2xl:text-5xl py-4 rounded-lg`}>
        Agendas
      </Link>

      <Link href="/artesanias" className={`bg-[url('/img/artesanias.jpg')] bg-cover text-white flex items-center justify-center text-center text-base md:text-lg lg:text-2xl xl:text-3xl 2xl:text-5xl py-4 rounded-lg`}>
        Artesanías
      </Link>

      <div className={`bg-[url('/img/eventos.jpg')] bg-cover text-white flex items-center justify-center text-center text-base md:text-lg lg:text-2xl xl:text-3xl 2xl:text-5xl py-4 rounded-lg`}>
        Decoraciones y Eventos
      </div>
      
      <div className={`bg-[url('/img/pasteleria.jpg')] bg-contain text-white flex items-center justify-center text-center text-base md:text-lg lg:text-2xl xl:text-3xl 2xl:text-5xl py-4 rounded-lg`}>
        Pastelería
      </div>

      <Link href="/reposteria" className={`bg-[url('/img/reposteria.png')] bg-cover text-white flex items-center justify-center text-center text-base md:text-lg lg:text-2xl xl:text-3xl 2xl:text-5xl py-4 rounded-lg`}>
        Repostería
      </Link>
      
      <div className={`bg-[url('/img/scrapbook.jpg')] bg-cover text-white flex items-center justify-center text-center text-base md:text-lg lg:text-2xl xl:text-3xl 2xl:text-5xl py-4 rounded-lg`}>
        Scrapbook
      </div>
    </div>
  );
}
