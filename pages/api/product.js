import nc from 'next-connect'
import cors from 'cors'

//import products from '../../src/data/data'

require('dotenv').config()

export default async function handler(req, res) {
    const rawProducts = await fetch(
        `${process.env.SHOPIFY_DOMAIN}/admin/api/${process.env.API_VERSION}/products.json`,
        {
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': process.env.ACCESS_TOKEN
            }
        }
    )
    const products = await rawProducts.json()
    res.json({data: products})
}
