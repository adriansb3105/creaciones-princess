import { getAgendas } from '@/src/app/utils/hooks/agendas'
import Image from 'next/image'
import { Card, CardBody, Heading, Stack, Text } from '@chakra-ui/react'

const getInformation = async () => {
  const res = await getAgendas()
  return res
}

export default async function Emprendimiento() {
    const agendas = await getInformation()

  return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agendas.emprendimiento.map((agenda) => (
            <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
            >
            <Image
              objectFit='cover'
              src={`${agenda.path + agenda.filename + '.jpg'}`}
              alt={`${agenda.name}`}
              className='w-full'
                width={150}
                height={100}
            />
          
            <Stack>
              <CardBody>
                <Heading size='md'>{agenda.name}</Heading>
          
                <Text py='2'>
                {agenda.description}
                </Text>
              </CardBody>
            </Stack>
          </Card>
        ))}
        </div>
    </div>
  )
}