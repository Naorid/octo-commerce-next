import nc from 'next-connect'
import cors from 'cors'
import {shopifyCall} from "../../src/utils/apicall";
import {shopifyFormat} from "../../src/utils/productFormat"

require('dotenv').config()

export default async function handler(req, res) {
    const rawProducts = await shopifyCall('products.json')

    if (!rawProducts.ok) {
        res.writeHead(302, { Location: '/products' })
        res.end()
        return {props: {}}
    }

    const shopifyProducts = (await rawProducts.json()).products
    console.log(shopifyProducts[0])

    const products = shopifyProducts.map(shopifyFormat)
    res.json({data: products})
}
