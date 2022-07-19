import {
    Button,
    Flex,
    Heading,
    Link,
    Stack,
    Text,
    useColorModeValue as mode,
} from '@chakra-ui/react'
import Router from 'next/router'
import * as React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { formatPrice } from './PriceTag'

const OrderSummaryItem = (props) => {
    const { label, value, children } = props
    return (
        <Flex justify="space-between" fontSize="sm">
            <Text fontWeight="medium" color={mode('gray.600', 'gray.400')}>
                {label}
            </Text>
            {value ? <Text fontWeight="medium">{value}</Text> : children}
        </Flex>
    )
}

export async function createCheckout(cartLines) {
    // const rawData = await fetch(`http://localhost:3000/api/createCheckout`,
    //     {
    //         method: 'POST',
    //         headers: {
    //             'content-type': 'application/json'
    //         },
    //         body: JSON.stringify(cartLines)
    //     })
    // const data = await rawData.json()
    // await Router.push(data.data.checkoutCreate.checkout.webUrl)
    await Router.push("/checkout")
}

/*
{
  checkoutCreate: {
    checkout: {
      id: 'gid://shopify/Checkout/41b626a91f5469264684c001f3ce2a89?key=090759487d8838a97fd2f44d924d8e25',
      webUrl: 'https://octoecommerce1.myshopify.com/64025985236/checkouts/41b626a91f5469264684c001f3ce2a89?key=090759487d8838a97fd2f44d924d8e25',
      lineItems: [Object]
    }
  }
}
 */

export const CartOrderSummary = (props) => {
    const {
        estimated_cost,
        reload
    } = props
    const subtotal = estimated_cost.subtotalAmount.amount
    const total = estimated_cost.totalAmount.amount

    const cartLines = {
        lineItems: [props.lines].map(line => {
            return {
                variantId: line.edges[0].node.merchandise.id,
                quantity: line.edges[0].node.quantity
            }
        })
    }
    // console.log("cartLines=", cartLines)

    return (
        <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
            <Heading size="md">Order Summary</Heading>

            <Stack spacing="6">
                <OrderSummaryItem label="Subtotal" value={!reload ? formatPrice(subtotal) : "Loading..."} />
                <Flex justify="space-between">
                    <Text fontSize="lg" fontWeight="semibold">
                        Total
                    </Text>
                    <Text fontSize="xl" fontWeight="extrabold">
                        {!reload ? formatPrice(total) : "Loading..."}
                    </Text>
                </Flex>
            </Stack>
            <Button colorScheme="blue"
                    size="lg"
                    fontSize="md"
                    rightIcon={<FaArrowRight />}
                    onClick={() => createCheckout(cartLines)}
            >
                {/*<Link href={"/checkout"}></Link>*/}

                {/*<Link href="/checkout">*/}
                {/*    Checkout*/}
                {/*</Link>*/}
            </Button>
        </Stack>
    )
}
