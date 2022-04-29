import nc from 'next-connect'
import products from '../../../src/data/data'
import {shopifyCall} from "../../../src/utils/apicall";
import {shopifyFormat} from "../../../src/utils/productFormat";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const rawProduct = await shopifyCall(`products/${req.query.id}.json`)
        console.log(rawProduct)
        if (!rawProduct.ok) {
            res.writeHead(302, { Location: `/product/${req.query.id}` })
            res.end()
            return {props: {}}
        }
        const shopifyProduct = await rawProduct.json()

        const product = shopifyFormat(shopifyProduct)
        console.log(product)
        res.json({data: product})
    }
}
