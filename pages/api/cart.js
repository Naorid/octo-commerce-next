import {shopifyGraphQL} from "../../src/utils/apicall";
import {shopifyCartFormat} from "../../src/utils/dataFormats";

// Get an existing Cart

export default async function handler(req, res) {
    const cartId = req.query.cartId

    if (cartId === undefined || cartId == "null") {
        res.end()
        return {props: {}}
    }

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
}
