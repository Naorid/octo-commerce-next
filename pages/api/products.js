import {shopifyCall} from "../../src/utils/apicall";
import {shopifyProductFormat} from "../../src/utils/dataFormats"
import {config} from "dotenv"

config()

export default async function handler(req, res) {
    const rawProducts = await shopifyCall('products.json')

    if (!rawProducts.ok) {
        res.writeHead(302, { Location: '/products' })
        res.end()
        return {props: {}}
    }

    const shopifyProducts = (await rawProducts.json()).products

    const products = shopifyProducts.map(shopifyProductFormat)
    res.json({data: products})
}
