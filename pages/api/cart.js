import {shopifyGraphQL} from "../../src/utils/apicall";
import {shopifyCartFormat} from "../../src/utils/dataFormats";
import {config} from "dotenv";
import {apiRoot, projectKey} from "../../src/utils/commerceToolsConfig";

config()

const commerceToolsMode = `${process.env.PROVIDER}` === 'COMMERCE_TOOLS'

// Get an existing Cart

async function shopifyCart(req, res) {
    const cartId = req.query.cartId

    const rawCart = await shopifyGraphQL(
        `query {
  cart(
    id: "gid://shopify/Cart/${cartId}"
  ) {
    id
    createdAt
    updatedAt
    lines(first: 10) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
            }
          }
          attributes {
            key
            value
          }
        }
      }
    }
    attributes {
      key
      value
    }
    estimatedCost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
      totalDutyAmount {
        amount
        currencyCode
      }
    }
    buyerIdentity {
      email
      phone
      customer {
        id
      }
      countryCode
    }
  }
}`
    )

    const shopifyCart = (await rawCart.json()).data.cart
    console.log('shopifyCart=', shopifyCart)
    console.log('lines=', shopifyCart.lines.edges)

    const cart = shopifyCartFormat(shopifyCart)
    res.json({data: cart})
    return res
}

async function commerceToolsCart(req, res) {
    await apiRoot
        .withProjectKey({ projectKey })
        .carts()
        .get({
            queryArgs: {
                id: req.query.cartId
            }
        })
        .execute()
        .then(result => {
            console.log("cart", result)
            // const rawResults = result.body.data.products.results;
            // if (!rawResults.length) {
            //     return res
            //         .status(404)
            //         .json({ error: 'No products was found !' });
            // }
            // console.log("rawResults=", rawResults)
            // const products = Array.from(rawResults).map(rawResult => {
            //     return {
            //         id: rawResult.id,
            //         name: rawResult.masterData.current.name,
            //         image: rawResult.masterData.current.masterVariant.images[0].url,
            //         price: rawResult.masterData.current.masterVariant.prices[0].value.centAmount.toString(),
            //         compare_at_price: null,
            //         description: rawResult.masterData.current.description
            //     }
            // })
            // console.log("products=", products)
            // return res.status(200).json({
            //     data: products
            // });
        })
        .catch(e => {
            // console.error(e);
            res.status(400).json(e);
        })
    return res
}

export default async function handler(req, res) {
    console.log("Bonjour")
    const cartId = req.query.cartId

    if (cartId === undefined || cartId == "null") {
        res.end()
        return {props: {}}
    }

    if (commerceToolsMode) {
        return await commerceToolsCart(req, res)
    } else {
        return await shopifyCart(req, res)
    }
}
