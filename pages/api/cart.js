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
    console.log("cartObject=", cart.lines.edges)
    res.json({data: cart})
    return res
}

async function commerceToolsCart(req, res) {
    await apiRoot
        .withProjectKey({ projectKey })
        .carts()
        .withId({ID: req.query.cartId})
        .get()
        .execute()
        .then(result => {
            console.log("cart", result)
            const rawResult = result.body;
            console.log(rawResult)
            const cart = {
                id: rawResult.id,
                lines: {
                    edges: rawResult.lineItems.map(line => {
                        return {
                            node: {
                                line,
                                merchandise: line.id,
                                quantity: line.quantity,
                                image: line.variant.images[0].url
                            }
                        }
                    })
                },
                estimated_cost: {
                    totalAmount: {
                        amount: rawResult.totalPrice.centAmount / 100
                    },
                    subtotalAmount: {
                        amount: rawResult.totalPrice.centAmount / 100
                    }
                },
            }
            console.log("cart Object=", cart.lines.edges)
            return res.status(200).json({
                data: cart
            });
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
