import {shopifyGraphQL} from "../../src/utils/apicall";
import {apiRoot, projectKey} from "../../src/utils/commerceToolsConfig";
import {getCartVersion} from "./deleteLineCart";

const commerceToolsMode = `${process.env.PROVIDER}` === 'COMMERCE_TOOLS'
const commerceToolsModifyProductQuery = (cartVersion, lineItemId, quantity) => `
{
  "version" : ${cartVersion},
  "actions" : [ {
        "action" : "changeLineItemQuantity",
        "lineItemId" : "${lineItemId}",
        "quantity" : ${quantity}
  } ]
}`

async function shopifyModifyQuantity(req, res) {
    const cartId = req.body.cartId //(await JSON.parse(req.body)).cartId
    const cartLineId = req.body.cartLineId
    const quantity = req.body.quantity

    if (req.method !== 'POST') {
        res.end()
        return {props: {}}

    }

    const rawResponse = await shopifyGraphQL(`mutation {
  cartLinesUpdate(
    cartId: "${cartId}"
    lines: {
      id: "${cartLineId}"
      quantity: ${quantity}
    }
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

async function commerceToolsModifyQuantity(req, res) {
    const cartId = req.body.cartId //(await JSON.parse(req.body)).cartId
    const cartLineId = req.body.cartLineId
    const quantity = req.body.quantity

    const cartVersion = await getCartVersion(cartId)

    console.log("Modify Quantity")
    return await apiRoot
        .withProjectKey({ projectKey })
        .carts()
        .withId({ID: cartId.toString() })
        .post({
            body: commerceToolsModifyProductQuery(cartVersion, cartLineId, quantity)
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

export default async function handler(req, res) {
    if (commerceToolsMode) {
        await commerceToolsModifyQuantity(req, res)
        res.status(200)
        res.end()
        return res
    } else {
        return await shopifyModifyQuantity(req, res)
    }
}