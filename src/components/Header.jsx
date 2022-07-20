import {Box, Button, Container, Heading, Text, Image} from "@chakra-ui/react";

export function removeCart() {
    sessionStorage.removeItem('cartId')
}

function Header() {
    return (
        <Container>
            <Box></Box>
            <img src="/assets/octobook.png" alt="" id="octobook"></img>
            <Button bgColor={"#00b0cb"} onClick={() => removeCart()}>Remove Cart</Button>
            <a href='http://127.0.0.1:5500/octobook-delivery/front/landing.html'>Commandes</a>
        </Container>
    )
}

export default Header