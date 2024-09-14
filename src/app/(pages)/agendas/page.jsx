import AgendaSalon from './AgendaSalon'
import AgendaSaprissa from './AgendaSaprissa'
import Agenda4DiasPorHoja from './Agenda4DiasPorHoja'
import Cuadernos from './Cuadernos'
import Hombre from './Hombre'
import Diaria from './Diaria'
import Emprendimiento from './Emprendimiento'


import { Box } from '@chakra-ui/react'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react'

export default function Agendas() {
    return (
    <main className="px-10 py-4 bg-[#ffe5ff]">
      <h2 className="bg-[#ffe5ff] text-center text-3xl md:text-2xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-bold text-[#94E8D5] py-1">Agendas</h2>


      <Accordion allowToggle allowMultiple defaultIndex={0}>
          <AccordionItem>
            <h2>
              <AccordionButton _expanded={{ bg: '#94E8D5', color: 'white' }}>
                <Box as='span' flex='1' textAlign='left'>
                  <h3 className="text-3xl md:text-2xl lg:text-4xl xl:text-4xl 2xl:text-5xl text-white py-1">Agenda para Salón de Belleza</h3>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <AgendaSalon />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton _expanded={{ bg: '#94E8D5', color: 'white' }}>
                <Box as='span' flex='1' textAlign='left'>
                  <h3 className="text-3xl md:text-2xl lg:text-4xl xl:text-4xl 2xl:text-5xl text-white py-1">Agenda del Deportivo Saprissa</h3>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <AgendaSaprissa />
            </AccordionPanel>
          </AccordionItem>
          
          <AccordionItem>
            <h2>
              <AccordionButton _expanded={{ bg: '#94E8D5', color: 'white' }}>
                <Box as='span' flex='1' textAlign='left'>
                  <h3 className="text-3xl md:text-2xl lg:text-4xl xl:text-4xl 2xl:text-5xl text-white py-1">Agenda de 4 Días por Hoja</h3>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Agenda4DiasPorHoja />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton _expanded={{ bg: '#94E8D5', color: 'white' }}>
                <Box as='span' flex='1' textAlign='left'>
                  <h3 className="text-3xl md:text-2xl lg:text-4xl xl:text-4xl 2xl:text-5xl text-white py-1">Cuadernos</h3>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Cuadernos />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton _expanded={{ bg: '#94E8D5', color: 'white' }}>
                <Box as='span' flex='1' textAlign='left'>
                  <h3 className="text-3xl md:text-2xl lg:text-4xl xl:text-4xl 2xl:text-5xl text-white py-1">Hombre</h3>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Hombre />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton _expanded={{ bg: '#94E8D5', color: 'white' }}>
                <Box as='span' flex='1' textAlign='left'>
                  <h3 className="text-3xl md:text-2xl lg:text-4xl xl:text-4xl 2xl:text-5xl text-white py-1">Diaria</h3>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Diaria />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton _expanded={{ bg: '#94E8D5', color: 'white' }}>
                <Box as='span' flex='1' textAlign='left'>
                  <h3 className="text-3xl md:text-2xl lg:text-4xl xl:text-4xl 2xl:text-5xl text-white py-1">Emprendimiento</h3>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Emprendimiento />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      
    </main>
    )
}