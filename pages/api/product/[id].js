import nc from 'next-connect'
import products from '../../../src/data/data'
import {shopifyCall} from "../../../src/utils/apicall";
import {shopifyProductFormat} from "../../../src/utils/dataFormats";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const rawProduct = await shopifyCall(`products/${req.query.id}.json`)

        if (!rawProduct.ok) {
            res.writeHead(302, { Location: `/product/${req.query.id}` })
            res.end()
            return {props: {}}
        }
        const shopifyProduct = (await rawProduct.json()).product

        const product = shopifyProductFormat(shopifyProduct)
        res.json({data: product})
    }
}
