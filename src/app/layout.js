import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Head from "./components/Head";
import { ChakraProvider } from '@chakra-ui/react'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full">
      <Head />
      <body className={`${inter.className} flex flex-col m-0 p-0 box-border list-none min-h-full font-[Allura-Regular]`}>
        <NavBar />
        <ChakraProvider>
          <div className="bg-[#ffe5ff]">
            {children}
          </div>
        </ChakraProvider>
        <Footer/>
      </body>
    </html>
  );
}
