import {Box, Button, Flex, Heading, HStack, Link, Stack, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {CartItem} from "../src/components/CartItem";
import {CartOrderSummary} from "../src/components/CartOrderSummary";

async function createCart() {
    await fetch(`http://localhost:3000/api/addProductToCart`,
        {
            method: 'POST',
            // headers: {
            //     'content-type': 'application/json',
            // },
            body: `{
                "id": "7602169348308"
            }`
        }
    )
}

export default function Cart() {
    const [id, setId] = useState(null)
    const cartData = []

    useEffect(() => {
        setId(localStorage.getItem("cartId"))
    }, [])

    if (id === null) {
        return (
            <Box>
                <Text>Cart Empty</Text>
            </Box>
        )
    }

    return (
        <Box
            maxW={{ base: '3xl', lg: '7xl' }}
            mx="auto"
            px={{ base: '4', md: '8', lg: '12' }}
            py={{ base: '6', md: '8', lg: '12' }}
        >
            <Button onClick={() => createCart()}>Test Create Cart</Button>
            <Stack
                direction={{ base: 'column', lg: 'row' }}
                align={{ lg: 'flex-start' }}
                spacing={{ base: '8', md: '16' }}
            >
                <Stack spacing={{ base: '8', md: '10' }} flex="2">
                    <Heading fontSize="2xl" fontWeight="extrabold">
                        Shopping Cart (3 items)
                    </Heading>

                    <Stack spacing="6">
                        {cartData.map((item) => (
                            <CartItem key={item.id} {...item} />
                        ))}
                    </Stack>
                </Stack>

                <Flex direction="column" align="center" flex="1">
                    <CartOrderSummary />
                    <HStack mt="6" fontWeight="semibold">
                        <p>or</p>
                        {/*<Link color={mode('blue.500', 'blue.200')}>Continue shopping</Link>*/}
                    </HStack>
                </Flex>
            </Stack>
        </Box>
    )
}