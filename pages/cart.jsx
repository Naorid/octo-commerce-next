import {Box, Button, Flex, Heading, HStack, Link, Stack, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {CartItem} from "../src/components/CartItem";
import {CartOrderSummary} from "../src/components/CartOrderSummary";
import Header from "../src/components/Header";

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

async function productFromVariant(variantId) {
    const rawProduct = await fetch(`http://localhost:3000/api/productFromVariant?variantId=${variantId}`)

    if (!rawProduct.ok) {
        return {}
    }
    const product = (await rawProduct.json()).data

    return product
}

export async function modifyQuantityCart(quantity, cartLineId, cartId, setReload) {
    await fetch(`http://localhost:3000/api/modifyQuantityCart`,
        {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: `{
                "cartId": "${cartId}",
                "cartLineId": "${cartLineId}",
                "quantity": "${quantity}"
            }`
        })
    setReload(true)
}

export async function deleteLineCart(cartLineId, cartId, setReload) {
    await fetch(`http://localhost:3000/api/deleteLineCart`,
        {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: `{
                "cartId": "${cartId}",
                "cartLineId": "${cartLineId}"
            }`
        })
    setReload(true)
}



export default function Cart({ products }) {
    const [id, setId] = useState(null)
    const [cartData, setCartData] = useState([])
    const [cartMetaData, setCartMetaData] = useState({})
    const [reload, setReload] = useState(true)

    useEffect(() => {
        setId(sessionStorage.getItem('cartId'))
    }, [])

    useEffect(() => {
        if (window && id) {
            fetch(`http://localhost:3000/api/cart?cartId=${id}`)
                .then((res) => res.json())
                .then(async (data) => {
                    console.log(data)
                    const lines = data.data.lines.edges
                    // console.log(lines)
                    const newLines = []
                    for (let i = 0; i < lines.length; i++) {
                        const newObj = {
                            quantity: lines[i].node.quantity,
                            ...await productFromVariant(lines[i].node.merchandise.id),
                            ...lines[i]
                        }
                        newLines.push(newObj)
                    }
                    setCartData(newLines)
                    setCartMetaData(data.data)
                })
        }
        setReload(false)

    }, [id, reload])

    if (id === null || cartData.length == 0 || cartMetaData === {}) {
        return (
            <Box>
                <Header></Header>
                <Text>Cart Empty</Text>
            </Box>
        )
    }

    console.log(cartData)

    return (
        <Box
            maxW={{ base: '3xl', lg: '7xl' }}
            mx="auto"
            px={{ base: '4', md: '8', lg: '12' }}
            py={{ base: '6', md: '8', lg: '12' }}
        >
            <Header></Header>
            <Text>Cart id : {id}</Text>
            <Stack
                direction={{ base: 'column', lg: 'row' }}
                align={{ lg: 'flex-start' }}
                spacing={{ base: '8', md: '16' }}
            >
                <Stack spacing={{ base: '8', md: '10' }} flex="2">
                    <Heading fontSize="2xl" fontWeight="extrabold">
                        Shopping Cart ({cartData.length} items)
                    </Heading>

                    <Stack spacing="6">
                        {cartData.map((item) => (
                            <CartItem key={item.id} setReload={setReload} {...item} cartId={cartMetaData.id}
                                      onClickDelete={deleteLineCart}
                                      onChangeQuantity={modifyQuantityCart}/>
                        ))}
                    </Stack>
                </Stack>

                <Flex direction="column" align="center" flex="1">
                    <CartOrderSummary {...cartMetaData} {...cartData}/>
                    <HStack mt="6" fontWeight="semibold">
                        <p>or</p>
                        <Link href={'/'}>Continue shopping</Link>
                    </HStack>
                </Flex>
            </Stack>
        </Box>
    )
}