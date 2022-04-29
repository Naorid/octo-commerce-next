import nc from 'next-connect'
import cors from 'cors'
import products from '../../src/data/data'

const handler = nc()
    .use(cors())
    // GET returns all products
    .get((req, res) => {
        res.json({data: products})
    })
    // POST add a product
    .post((req, res) => {
        const id = Date.now()
        const product = {...req.body, id}

        products.push(product)
        res.json({data: product})
    })

export default handler