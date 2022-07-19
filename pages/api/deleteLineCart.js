import {shopifyGraphQL} from "../../src/utils/apicall";
import {apiRoot, projectKey} from "../../src/utils/commerceToolsConfig";

const commerceToolsMode = `${process.env.PROVIDER}` === 'COMMERCE_TOOLS'
const commerceToolsDeleteProductQuery = (cartVersion, lineItemId) => `
{
    "version": ${cartVersion},
    "actions": [
        {
            "action" : "removeLineItem",
            "lineItemId" : "${lineItemId}"
          }
    ]
}`

export async function getCartVersion(cartId) {
    // Get cart version
    console.log("Cart Version")
    return await apiRoot
        .withProjectKey({ projectKey })
        .carts()
        .withId({ID: cartId.toString()})
        .get()
        .execute()
        .then(async result => {
            console.log("cart", result)
            // console.log(cart)
            return result.body.version
        })
        .catch(e => {
            console.error(e);
        })
}

async function commerceToolsDeleteProduct(req, res) {
    const cartId = req.body.cartId //(await JSON.parse(req.body)).cartId
    const cartLineId = req.body.cartLineId

    const cartVersion = await getCartVersion(cartId)

    console.log("Modify Quantity")
    return await apiRoot
        .withProjectKey({ projectKey })
        .carts()
        .withId({ID: cartId.toString() })
        .post({
            body: commerceToolsDeleteProductQuery(cartVersion, cartLineId)
        })
        .execute()
        .then(result => {
            const rawResult = result.body
            console.log("cart rawResult=", rawResult)
            const cart = {
                id: rawResult.id,
                line: rawResult.lineItems,
                estimated_cost: rawResult.totalPrice.centAmount,
            }
            console.log("cart=", cart)
            return cart
        })
        .catch((e) => {
            console.error("error", e, e.body.errors, "errorEnd")
        })
}

async function shopifyDeleteProduct(req, res) {
    console.log(req.body)
    const cartId = req.body.cartId //(await JSON.parse(req.body)).cartId
    const cartLineId = req.body.cartLineId

    if (req.method !== 'POST') {
        res.end()
        return {props: {}}

    }

    const rawResponse = await shopifyGraphQL(`mutation {
  cartLinesRemove(
    cartId: "${cartId}"
    lineIds: "${cartLineId}"
  ) {
    cart {
      id
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
          }
        }
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
    }
  }
}`)

    console.log(rawResponse)

    res.end()
    return {props: {}}
}

export default async function handler(req, res) {
    if (commerceToolsMode) {
        await commerceToolsDeleteProduct(req, res)
        res.status(200)
        res.end()
        return res
    } else {
        return await shopifyDeleteProduct(req, res)
    }
}