import {Box, Button, Text} from "@chakra-ui/react";
import Header, {removeCart} from "../src/components/Header";
import {useState} from "react";
import {useEffect} from "react";
import Router from "next/router";


async function createOrder(id) {
    const rawData = await fetch(`http://localhost:3000/api/createOrder`,
        {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                cartId: id,
                shippingAddress: {
                    country: "FR"
                }
            })
        })
    console.log("Order=", rawData)
    if (rawData.ok) {
        console.log("OK!")
    }
    removeCart()
    await Router.push("/")
}


export default function Page() {
    const [id, setId] = useState(null)

    useEffect(() => {
        setId(sessionStorage.getItem('cartId'))
    }, [])

    return (
        <Box>
            <Header></Header>
            <Text>Checkout</Text>
            <Text>Id={id}</Text>
            <Button onClick={() => createOrder(id)}>CreateCheckout</Button>
        </Box>
    )
}