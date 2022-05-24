import {shopifyCall, shopifyGraphQL} from "../../src/utils/apicall";
import {shopifyProductFormat} from "../../src/utils/dataFormats";

async function findProductFromVariant(products, variantId) {
    for (let i = 0; i < products.length; i++) {
        const product = products[i]

        const rawProductVariants = await shopifyGraphQL(
            `
            {
                node(id: "gid://shopify/Product/${product.id}") {
                    id
                    ... on Product {
                        variants(first: 5) {
                            edges {
                                node {
                                    id
                                }
                            }
                        }
                    }
                }
            }`
        )
        const productVariants = (await rawProductVariants.json())
        const productVariantId = productVariants.data.node.variants.edges[0].node.id
        // console.log('productVariantId=', productVariantId)
        // console.log('variantId=', variantId)
        // console.log(productVariantId === variantId)

        if (productVariantId === variantId)
            return product
    }
    return undefined
}


// Get Product from Variant Id (in query)
export default async function handler(req, res) {
    const variantId = req.query.variantId

    const rawProducts = await shopifyCall('products.json')

    if (!rawProducts.ok) {
        res.end()
        return {props: {}}
    }

    const shopifyProducts = (await rawProducts.json()).products
    const products = shopifyProducts.map(shopifyProductFormat)

    // console.log(products)
    const product = await findProductFromVariant(products, variantId)
    // console.log("Bonjour")
    // console.log(product)

    res.json({data: product})
}