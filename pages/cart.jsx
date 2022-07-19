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
    console.log("Product=", product)

    return product
}

export async function onChangeQuantity(quantity, cartLineId, cartId, setReload) {
    console.log("cartLineId=", cartLineId)
    setReload(true)
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
}

export async function onClickDelete(cartLineId, cartId, setReload) {
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
    const [updated, setUpdated] = useState(false)

    useEffect(() => {
        const storedId = sessionStorage.getItem('cartId')
        console.log(storedId)
        setId(storedId)
        if (storedId === null) {
            setUpdated(true)
        }
    }, [])

    useEffect(() => {
        if (window && id) {
            fetch(`http://localhost:3000/api/cart?cartId=${id}`)
                .then((res) => res.json())
                .then(async (data) => {
                    const lines = data.data.lines.edges
                    // console.log(lines)
                    const newLines = []
                    for (let i = 0; i < lines.length; i++) {
                        let newObj = {}
                        // CommerceTools product
                        if (lines[i].node.line) {
                            newObj = {
                                image: lines[i].node.line.variant.images[0].url,
                                ...await productFromVariant(lines[i].node.merchandise.id),
                                ...lines[i],
                                quantity: lines[i].node.quantity,
                                name: lines[i].node.line.name.fr,
                                price: lines[i].node.line.price.value.centAmount / 100,
                                lineId: lines[i].node.line.id
                            }
                            // Shopify Product
                        } else {
                            newObj = {
                                ...await productFromVariant(lines[i].node.merchandise.id),
                                ...lines[i],
                                quantity: lines[i].node.quantity,
                            }
                        }
                        newLines.push(newObj)
                    }
                    setCartData(newLines)
                    console.log("CartData=", newLines)
                    setCartMetaData(data.data)
                    console.log("MetaData=", data.data)
                    setReload(false)
                })
                .then(() => setUpdated(true))
                .catch((e) => console.log(e) && setUpdated(true))
        } else {
            setReload(false)
        }

    }, [id, reload])

    if (!updated) {
        return (
            <Box>
                <Header></Header>
                <Text>Loading...</Text>
            </Box>
        )
    } else if (cartData.length === 0) {
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
                            <CartItem key={item.id} setReload={setReload} reload={reload} {...item} cartId={cartMetaData.id}
                                      onClickDelete={onClickDelete}
                                      onChangeQuantity={onChangeQuantity}/>
                        ))}
                    </Stack>
                </Stack>

                <Flex direction="column" align="center" flex="1">
                    <CartOrderSummary {...cartMetaData} {...cartData} reload={reload}/>
                    <HStack mt="6" fontWeight="semibold">
                        <p>or</p>
                        <Link href={'/'}>Continue shopping</Link>
                    </HStack>
                </Flex>
            </Stack>
        </Box>
    )
}
