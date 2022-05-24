import {shopifyGraphQL} from "../../src/utils/apicall";

export default async function handler(req, res) {
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