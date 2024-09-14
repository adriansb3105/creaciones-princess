import { getPasteles } from '@/src/app/utils/hooks/pasteleria'
import Image from 'next/image'
import { Card, CardBody, Heading, Stack, Text } from '@chakra-ui/react'

const getInformation = async () => {
  const res = await getPasteles()
  return res
}

export default async function TortasFrias() {
    const pasteles = await getInformation()

  return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pasteles.tortasFrias.tortas.map((torta) => (
            <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
            >
            <Image
              src={`${torta.path + torta.filename + '.jpg'}`}
              alt={`${torta.name}`}
              className='w-full'
                width={150}
                height={100}
            />
          
            <Stack>
              <CardBody>
                <Heading size='md'>{torta.name}</Heading>
          
                <Text py='2'>
                {torta.description}
                </Text>
              </CardBody>
            </Stack>
          </Card>
        ))}
        </div>
    </div>
  )
}