import {Box, Button, Container, Heading, Text} from "@chakra-ui/react";

export function removeCart() {
    sessionStorage.removeItem('cartId')
}

function Header() {
    return (
        <Container>
            <Box></Box>
            <Heading>OctoBook</Heading>

            <Text>{"<Inserer Description>"}</Text>

            <Button onClick={() => removeCart()}>Remove Cart</Button>
        </Container>
    )
}

export default Header