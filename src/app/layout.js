import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "./components/Navbar";
import { Footer } from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Creaciones Princess",
  description: "Las mejores creaciones para tí!"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className='flex flex-col m-0 p-0 box-border list-none font-serif h-full min-h-full'>
      <body className={`${inter.className} flex flex-col m-0 p-0 box-border list-none font-serif min-h-full `}>
        <NavBar />
        {children}
        <Footer/>
        </body>
    </html>
  );
}
