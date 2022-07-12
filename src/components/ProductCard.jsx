import {
    AspectRatio,
    Box,
    Button,
    HStack,
    Image,
    Link,
    Skeleton,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue,
} from '@chakra-ui/react'
import * as React from 'react'
import { Rating } from './Rating'
import { FavouriteButton } from './FavouriteButton'
import { PriceTag } from './PriceTag'

async function addProductToCartButton(productId) {
    console.log("productId", productId)
    // console.log(sessionStorage.getItem('cartId'))
    // call addProductToCart
    const rawCartId = await fetch("http://localhost:3000/api/addProductToCart",
        {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: `{
                "productId": "${productId}",
                "cartId": "${sessionStorage.getItem('cartId')}"
            }`
        })

    const cartId = (await rawCartId.json()).data
    console.log(cartId)
    sessionStorage.setItem('cartId', cartId[0] === 'g' ? cartId.toString().split('gid://shopify/Cart/')[1] : cartId)
}

export const ProductCard = (props) => {
    const { product, rootProps } = props
    const { name, image, compare_at_price, price, rating } = product
    return (
        <Stack
            spacing={useBreakpointValue({
                base: '4',
                md: '5',
            })}
            {...rootProps}
        >
            <Link href={"/product/" + product.id}>
                <Box position="relative">
                    <AspectRatio ratio={4 / 3}>
                        <Image
                            src={image}
                            alt={name}
                            draggable="false"
                            fallback={<Skeleton />}
                            borderRadius={useBreakpointValue({
                                base: 'md',
                                md: 'xl',
                            })}
                        />
                    </AspectRatio>
                    <FavouriteButton
                        position="absolute"
                        top="4"
                        right="4"
                        aria-label={`Add ${name} to your favourites`}
                    />
                </Box>

                <Stack>
                    <Stack spacing="1">
                        <Text fontWeight="medium" color={useColorModeValue('gray.700', 'gray.400')}>
                            {name}
                        </Text>
                        <PriceTag salePrice={price} price={compare_at_price} currency="EUR" />
                    </Stack>
                    {/*<HStack>*/}
                    {/*    <Rating defaultValue={rating} size="sm" />*/}
                    {/*    <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>*/}
                    {/*        12 Commentaires*/}
                    {/*    </Text>*/}
                    {/*</HStack>*/}
                </Stack>
            </Link>
            <Stack align="center">
                <Button colorScheme="blue" isFullWidth onClick={() => addProductToCartButton(product.id)}>
                    Ajouter au panier
                </Button>
                <Link
                    textDecoration="underline"
                    fontWeight="medium"
                    color={useColorModeValue('gray.600', 'gray.400')}
                >
                    Achat rapide
                </Link>
            </Stack>
        </Stack>
    )
}
