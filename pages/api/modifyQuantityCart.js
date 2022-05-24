import {shopifyGraphQL} from "../../src/utils/apicall";

export default async function handler(req, res) {
    console.log(req.body)
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