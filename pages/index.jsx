import {
    Box,
    Container,
    Heading,
    SimpleGrid,
    Text,
    VStack,
    Image,
    Link, Flex, Button,
} from '@chakra-ui/react'
import Header from "../src/components/Header";
import Footer from "../src/components/Footer"
import {ProductGrid} from "../src/components/ProductGrid";
import {ProductCard} from "../src/components/ProductCard";
import {useState} from "react";

export async function getStaticProps() {
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
    const [isLoading, setIsLoading] = useState(false)

    return (
        <Box>
             <VStack spacing={5}>
                <Header></Header>
                <Link href='/cart'>
                    <Button colorScheme="linkedin" isLoading={isLoading} onClick={() => setIsLoading(true)}>Panier</Button>
                </Link>

                <Box
                    maxW="7xl"
                    mx="auto"
                    px={{
                        base: '4',
                        md: '8',
                        lg: '12',
                    }}
                    py={{
                        base: '6',
                        md: '8',
                        lg: '12',
                    }}
                >
                    <ProductGrid>
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </ProductGrid>
                </Box>
                 <Footer></Footer>

             </VStack>
            {/*<Image src={"assets/img.png"}></Image>*/}
        </Box>
    )
}
