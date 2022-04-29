import nc from 'next-connect'
import products from '../../src/data/data'

const getProduct = id => products.find(n => n.id === parseInt(id))

const handler = nc()
    .get((req, res) => {
        const product = getProduct(req.query.id)

        if (!product) {
            res.status(404)
            res.end()
            return
        }

        res.json({data: product})
    })

    .patch((req, res) => {
        const product = getProduct(req.query.id)

        if (!product) {
            res.status(404)
            res.end()
            return
        }

        const i = products.findIndex(n => n.id === parseInt(requ.query.id))
        const updated = {...product, ...req.body}

        products[i] = updated

        res.json({data: updated})
    })

    .delete((req, res) => {
        const product = getProduct(req.query.id)

        if (!product) {
            res.status(404)
            res.end()
            return
        }

        const i = products.findIndex(n => n.id === parseInt(requ.query.id))

        products.splice(i, 1)

        res.json({data: req.query.id})
    })