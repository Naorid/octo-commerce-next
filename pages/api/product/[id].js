import {shopifyCall} from "../../../src/utils/apicall";
import {shopifyProductFormat} from "../../../src/utils/dataFormats";
import {config} from "dotenv";
import {apiRoot, projectKey} from "../../../src/utils/commerceToolsConfig";

config()

const commerceToolsMode = `${process.env.PROVIDER}` === 'COMMERCE_TOOLS'
const commerceToolsQuery = (productId) => `query {
    product(id: "${productId}") {
        id
        masterData {
            current {
                name(locale:"FR")
                masterVariant {
                    prices {
                        value {
                            centAmount
                        }
                    }
                    images {
                        url
                    }
                }
                description(locale:"FR")
            }
        }
    }
}`

async function shopifyProduct(req, res) {
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

async function commerceToolsProduct(req, res) {
    await apiRoot
    .withProjectKey({ projectKey })
    .graphql()
    .post({
        body: { query: commerceToolsQuery(req.query.id) }
    })
    .execute()
    .then(result => {
        const rawResult = result.body.data.product;
        console.log("rawResult=", rawResult)
        const product = {
            id: rawResult.id,
            name: rawResult.masterData.current.name,
            image: rawResult.masterData.current.masterVariant.images[0].url,
            price: rawResult.masterData.current.masterVariant.prices[0].value.centAmount.toString(),
            compare_at_price: null,
            description: rawResult.masterData.current.description
        }
        console.log("product=", product)
        return res.status(200).json({
            data: product
        });
    })
    .catch(e => {
        // console.error(e);
        res.status(400).json(e);
    });
    // res.end()
    return res
}

export default async function handler(req, res) {
    console.log(req)
    if (commerceToolsMode) {
        return await commerceToolsProduct(req, res)
    } else {
        return await shopifyProduct(req, res)
    }
}
