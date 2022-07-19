import {
    Box, Button, Input, Link, Select,
    Text,
} from "@chakra-ui/react";
import Header, {removeCart} from "../src/components/Header";
import Router from "next/router";

export default function Page() {
    const formSubmit = async (event) => {
        event.preventDefault();
        console.log(event.target)

        console.log()

        const rawData = await fetch(`http://localhost:3000/api/createOrder`,
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    cartId: (sessionStorage.getItem('cartId')).toString(),
                    shippingAddress: {
                        country: event.target.country.value === 'France' ? 'FR' : 'FR',
                        firstName: event.target.first.value,
                        lastName: event.target.last.value
                    },
                    polygram: event.target.polygram.value
                })
            })
        console.log("Order=", rawData)
        if (rawData.ok) {
            console.log("OK!")
            alert('Order Created')
        }
        removeCart()
        await Router.push("/")
    }

    return (
        <Box>
            <Header></Header>
            <Text>Checkout</Text>
            <form onSubmit={formSubmit}>
                <label htmlFor="first">First name:</label>
                <Input type="text" id="first" name="first"/>
                <label htmlFor="last">Last name:</label>
                <Input type="text" id="last" name="last"/>
                <label htmlFor="polygram">Polygram</label>
                <Input type="text" id="polygram" name="polygram"/>
                <label htmlFor="country">Country</label>
                <Select name="country" id="country">
                    <option style={{ color: 'black' }} value="">Select a country</option>
                    <option style={{ color: 'black' }} value="France">France</option>
                    <option style={{ color: 'black' }} value="Not France">Not France</option>
                </Select>
                <Button colorScheme="linkedin" type="submit">Order</Button>
            </form>

            <Link href="/">
                <Button colorScheme="linkedin">Home</Button>
            </Link>

            {/*<Button onClick={() => createOrder(id)}>Create Order</Button>*/}
        </Box>
    )
}