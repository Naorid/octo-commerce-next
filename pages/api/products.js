import {shopifyCall} from "../../src/utils/apicall";
import {shopifyProductFormat} from "../../src/utils/dataFormats"
import {config} from "dotenv"
import {apiRoot, projectKey} from "../../src/utils/commerceToolsConfig";

config()

const commerceToolsMode = `${process.env.PROVIDER}` === 'COMMERCE_TOOLS'
const commerceToolsQuery = `
    query {
  products {
    results {
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
  }
}
`

async function shopifyProducts(req, res) {
    const rawProducts = await shopifyCall('products.json')

    if (!rawProducts.ok) {
        res.writeHead(302, {Location: '/products'})
        res.end()
        return {props: {}}
    }

    const shopifyProducts = (await rawProducts.json()).products

    const products = shopifyProducts.map(shopifyProductFormat)
    res.json({data: products})
    console.log(products)
    return res
}

async function commerceToolsProducts(req, res) {
    await apiRoot
    .withProjectKey({ projectKey })
    .graphql()
    .post({
        body: { query: commerceToolsQuery }
    })
    .execute()
    .then(result => {
        const rawResults = result.body.data.products.results;
        if (!rawResults.length) {
            return res
                .status(404)
                .json({ error: 'No products was found !' });
        }
        console.log("rawResults=", rawResults)
        const products = Array.from(rawResults).map(rawResult => {
            return {
                id: rawResult.id,
                name: rawResult.masterData.current.name,
                image: rawResult.masterData.current.masterVariant.images[0].url,
                price: rawResult.masterData.current.masterVariant.prices[0].value.centAmount.toString(),
                compare_at_price: null,
                description: rawResult.masterData.current.description
            }
        })
        console.log("products=", products)
        return res.status(200).json({
            data: products
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
    if (commerceToolsMode) {
        return await commerceToolsProducts(req, res)
    } else {
        return await shopifyProducts(req, res)
    }
}
