import {CloseButton, Flex, Link, Select, Text, useColorModeValue} from '@chakra-ui/react'
import * as React from 'react'
import { PriceTag } from './PriceTag'
import { CartProductMeta } from './CartProductMeta'
import {useState} from "react";

const QuantitySelect = (props) => {
    return (
        <Select
            maxW="64px"
            aria-label="Select quantity"
            focusBorderColor={useColorModeValue('blue.500', 'blue.200')}
            {...props}
        >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
        </Select>
    )
}

export const CartItem = (props) => {
    const [quantity, setQuantity] = useState(props.quantity)

    const {
        isGiftWrapping,
        name,
        description,
        image,
        currency,
        price,
        onChangeQuantity,
        onClickDelete,
        node,
        lineId,
        cartId,
        setReload
    } = props
    console.log("cartId=", cartId)

    const reload = props.reload

    return (
        <Flex
            direction={{
                base: 'column',
                md: 'row',
            }}
            justify="space-between"
            align="center"
        >
            <CartProductMeta
                name={name}
                description={description}
                image={image}
                isGiftWrapping={isGiftWrapping}
            />

            {/* Desktop */}
            <Flex
                width="full"
                justify="space-between"
                display={{
                    base: 'none',
                    md: 'flex',
                }}
            >
                <QuantitySelect
                    value={quantity}
                    onChange={(e) => {
                        onChangeQuantity?.(+e.currentTarget.value, lineId, cartId, setReload)
                        setQuantity(e.currentTarget.value)
                    }}
                />
                <PriceTag price={price} currency={currency} />
                <CloseButton aria-label={`Delete ${name} from cart`} onClick={() => onClickDelete(node.id, lineId, setReload)} />
            </Flex>

            {/* Mobile */}
            <Flex
                mt="4"
                align="center"
                width="full"
                justify="space-between"
                display={{
                    base: 'flex',
                    md: 'none',
                }}
            >
                <Link fontSize="sm" textDecor="underline">
                    Delete
                </Link>
                <QuantitySelect
                    value={quantity}
                    onChange={(e) => {
                        onChangeQuantity?.(+e.currentTarget.value, node.id, lineId, setReload)
                        setQuantity(e.currentTarget.value)
                    }}
                />
                <PriceTag price={price} currency={currency} />
            </Flex>
        </Flex>
    )
}
