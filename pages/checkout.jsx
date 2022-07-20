import {
    Box, Button, Center, Input, Link, Select,
    Text,
} from "@chakra-ui/react";
import Header, {removeCart} from "../src/components/Header";
import Router from "next/router";
import {useEffect, useState} from "react";
import {users, usersData} from "../src/data/users";

export default function Page() {
    const [user, setUser] = useState(null)

    const [shopifyMode, setShopifyMode] = useState(true)

    useEffect(() => {
        fetch(`http://localhost:3000/api/shopifyMode`)
            .then(data => data.json())
            .then(data => setShopifyMode(data.data))
    }, [])

    const formSubmit = async (event) => {
        event.preventDefault();
        console.log(event.target)

        const polygram = event.target.polygram.value

        const email = users.find((user) => user.polygramme === polygram).mail

        console.log("email=", email)

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
                        email: email
                    },
                    delivery_man: event.target.delivery_man ? event.target.delivery_man.value : null
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

    useEffect(() => {
        setUser(sessionStorage.getItem('user'))
    }, [])


    // const user = sessionStorage.getItem('user')

    return (
        <Box
            maxW={{ base: '3xl', lg: '7xl' }}
            mx="auto"
            px={{ base: '4', md: '8', lg: '12' }}
            py={{ base: '6', md: '8', lg: '12' }}
        >
            <Header></Header>
            <br/>
            <br/>
            <form onSubmit={formSubmit}>
                <label htmlFor="polygram">Polygram:</label>
                <Input type="text" id="polygram" name="polygram" disabled value={user}/>
                {!shopifyMode ? <div>
                    <label htmlFor="delivery_man">Delivery Man</label>
                    <Input type="text" id="delivery_man" name="delivery_man"/>
                </div> : <div></div> }
                <label htmlFor="country">Country</label>
                <Select name="country" id="country">
                    <option style={{ color: 'black' }} value="">Select a country</option>
                    <option style={{ color: 'black' }} value="France">France</option>
                    <option style={{ color: 'black' }} value="Not France">Not France</option>
                </Select>
                <br/>
                <br/>
                <Center>
                    <Button colorScheme="linkedin" type="submit" width='200px'>Order</Button>
                </Center>
            </form>

            <br/>
            <br/>
            <br/>
            <Center>
                <Link href="/">
                    <Button colorScheme="linkedin" width='200px'>Home</Button>
                </Link>
            </Center>

            {/*<Button onClick={() => createOrder(id)}>Create Order</Button>*/}
        </Box>
    )
}