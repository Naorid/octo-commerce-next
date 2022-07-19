import {Box, Button, Container, Heading, Text, Image} from "@chakra-ui/react";

export function removeCart() {
    sessionStorage.removeItem('cartId')
}

function Header() {
    return (
        <Container>
            <Box></Box>
            <img src="/assets/octobook.png" alt="" id="octobook"></img>
            <Button colorScheme="linkedin" onClick={() => removeCart()}>Remove Cart</Button>
        </Container>
    )
}

export default Header