// import Image from "next/image";
/*const items = [
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
]*/


import { background } from '@chakra-ui/react'
import { Calendar, BookHeart, Boxes, Cake, CakeSlice, Croissant, Facebook, Globe, Instagram, Mails, MapPin, NotebookTabs, PartyPopper, Phone } from 'lucide-react'
import { Container } from 'postcss'

export default function Home() {
  const categories = [
    { icon: NotebookTabs, link: "agendas", title: "Agendas Personalizadas", image: "agendas.jpg" },
    { icon: Calendar, link: "libretas", title: "Planificadores y Calendarios", image: "planificador.jpg" },
    { icon: CakeSlice, link: "postres", title: "Postres Dulces y Salados", image: "postres.jpg" },
    { icon: Croissant, link: "reposteria", title: "Repostería Artesanal", image: "reposteria.png" },
    { icon: Boxes, link: "artesanias", title: "Artesanías y Manualidades", image: "artesanias.jpg" },
    { icon: PartyPopper, link: "eventos", title: "Decoraciones y Eventos", image: "eventos.jpg" },
    { icon: Cake, link: "pasteleria", title: "Pastelería", image: "pasteleria.jpg" },
    { icon: BookHeart, link: "scrapbooking", title: "Scrapbooking", image: "scrapbook.jpg" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <main>
        <section id="products" className="hero bg-pink-100 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl font-bold gradient-text mb-6">Descubre Nuestras Creaciones</h2>
            <p className="text-2xl text-gray-700 mb-8">Agendas personalizadas, libretas, calendarios, repostería, pan artesanal, postres, pastelería, chocolatería y más!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((item, index) => (
                /** href={`/${item.link}`} */
                <a key={index} className="p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow float bg-cover bg-center bg-no-repeat bg-transparent" style={{backgroundImage: `url('/img/${item.image}')`}}>
                  <item.icon className="w-16 h-16 mx-auto mb-4 text-pink-600" />
                  <h4 className="text-2xl shadow-xl font-bold text-white mb-2">{item.title}</h4>
                </a>
              ))}
            </div>

          </div>
        </section>

        <section id="whoweare" className="bg-pink-50 py-20">
          <div className="container mx-auto px-4">
            <h3 className="text-4xl text-center gradient-text mb-12">¿Quiénes somos?</h3>            
                <div className="p-12 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-3xl text-pink-600 text-justify">Somos un emprendiendo familiar que creamos pasteleria, repostería, pan artesanal, agendas, libretas, encuadernaciones, artesanías, manualidades, scrapbooking y mucho más con amor y dedicación.</p>
                  <p className="text-3xl text-pink-600 text-justify">Creaciones Princess surge de la unión madre e hija, teniendo en firme el objetivo de que la perfección de nuestros productos debe satisfacer a nuestros clientes.</p>
                </div>
          </div>
        </section>

        <section id="contact" className="py-20">
          <div className="container mx-auto px-4">
            <h3 className="text-4xl font-bold text-center gradient-text mb-12">Contáctenos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
                { icon: Facebook, title: "Facebook", description: "Creaciones Princess", link: "https://www.facebook.com/p/Creaciones-Princess-100026420864135/", target: "_blank"},
                { icon: Instagram, title: "Instagram", description: "Creaciones Princess", link: "https://www.instagram.com/creacionesprincess2912/", target: "_blank"},
                { icon: Phone, title: "Whatsapp", description: "8782-5868 / 8704-3365", link: "https://wa.me/50687825868", target: "_blank"},
                { icon: MapPin, title: "Ubicación", description: "Guadalupe, Cartago", link: "https://maps.app.goo.gl/h6JfM8V4BvmbfNmE9", target: "_blank"},
                { icon: Mails, title: "Correo electrónico", description: "creacionesprincess2912@gmail.com", link: "mailto:creacionesprincess2912@gmail.com", target: "_blank"},
                { icon: Globe, title: "Sitio web", description: "https://creacionesprincess.com", link: "#inicio", target: "_self"}
              ].map((item, index) => (
                <a href={`${item.link}`} target={`${item.target}`} key={index} className="bg-white p-6 rounded-full shadow-lg text-center hover:shadow-xl transition-shadow float">
                  <item.icon className="w-16 h-16 mx-auto mb-4 text-pink-600" />
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-xl">{item.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

