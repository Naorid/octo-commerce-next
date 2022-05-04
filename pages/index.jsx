import {Box, Container, Heading, SimpleGrid, Text, VStack, Image, Link, Divider, Stack} from '@chakra-ui/react'

export async function getServerSideProps(context) {
    const rawProducts = await fetch(`http://localhost:3000/api/products`)
    if (!rawProducts.ok) {
        return {props: {}}
    }
    const products = (await rawProducts.json()).data

    return {
        props: {products}
    }
}

export default function Page({ products }) {
    return (
        <Container>
            <VStack spacing={5}>
                <Box></Box>
                <Heading>Accueil</Heading>

                <Text>{"<Inserer Description>"}</Text>

                <SimpleGrid
                    columns={2}
                    spacing={8}>
                    {products.map(product => (
                        <Box
                            key={product.id}
                            boxShadow='md'
                            rounded='lg'
                            overflow='hidden'
                            borderWidth='1px'
                            bg='gray.50'>
                            <Image src={product.image} boxSize='250px' objectFit='cover'></Image>

                            <Box p='4'>
                                <Link href={"/product/" + product.id}>
                                    {product.title}
                                </Link>
                            </Box>
                        </Box>
                    ))}
                </SimpleGrid>
            </VStack>


            <VStack
                py='8'
                spacing={5}>
                <Divider></Divider>
                <Text>Footer</Text>
            </VStack>
        </Container>
    )
}
