import React from 'react'
import { useRouter} from 'next/router';
import Link from "next/link";
import {Box, Button, Container, Heading, HStack, Text, VStack} from "@chakra-ui/react";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";

export async function getServerSideProps(context) {
    const rawProduct = await fetch(`http://localhost:3000/api/product/${context.query.id}`)
    console.log(rawProduct)
    if (!rawProduct.ok) {
        return {props: {}}
    }
    const productJson = await rawProduct.json()
    const product = productJson.data

    return {
        props: {product}
    }
}

export default function Page({ product }) {
    const router = useRouter()
    const { id } = router.query

    return (
        <Container>
            <VStack spacing={5}>
                <Header></Header>

                <HStack spacing={5}>
                    <img width="300" height="300" src={product.image}></img>

                    <VStack>
                        <Heading as='h5'>{product.name}</Heading>
                        <Text fontSize='4xl'>
                            {product.price} €
                        </Text>
                        <Text>{product.description}</Text>
                    </VStack>
                </HStack>

                <Link href="/">
                    <Button colorScheme="linkedin">Home</Button>
                </Link>

                <Footer></Footer>
            </VStack>
        </Container>
    )
}
