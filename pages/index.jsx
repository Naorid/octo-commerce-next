import {
    Box,
    Container,
    Heading,
    SimpleGrid,
    Text,
    VStack,
    Image,
    Link,
} from '@chakra-ui/react'
import Header from "../src/components/Header";
import Footer from "../src/components/Footer"

export async function getStaticProps(context) {
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
                <Header></Header>

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
                                <Box>
                                    {product.price}
                                    <Box m={1} as='span' color='gray.600' fontSize='sm'>
                                        €
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </SimpleGrid>
            </VStack>

            <Footer></Footer>
        </Container>
    )
}
