'use client'
import React from 'react'
import TortasFrias from './TortasFrias'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'

export default function Pasteleria() {
    return (
    <main className="px-10 py-4 bg-[#ffe5ff]">
      <h2 className="bg-[#ffe5ff] text-center text-3xl md:text-2xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-bold text-[#94E8D5] py-1">Pastelería</h2>


      <Accordion allowToggle allowMultiple defaultIndex={0}>
          <AccordionItem>
            <h2>
              <AccordionButton _expanded={{ bg: '#94E8D5', color: 'white' }}>
                <Box as='span' flex='1' textAlign='left'>
                  <h3 className="text-3xl md:text-2xl lg:text-4xl xl:text-4xl 2xl:text-5xl text-white py-1">Tortas Frías</h3>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <TortasFrias />
            </AccordionPanel>
          </AccordionItem>

          
        </Accordion>
      
    </main>
    )
}