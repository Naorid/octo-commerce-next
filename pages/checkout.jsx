import {Box, Button, Text} from "@chakra-ui/react";
import Header from "../src/components/Header";


export default function Page() {

    return (
        <Box>
            <Header></Header>
            <Text>Checkout</Text>
            {/*<Button onClick={createShopifyCheckout()}>CreateCheckout</Button>*/}
        </Box>
    )
}