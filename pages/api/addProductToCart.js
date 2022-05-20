import {shopifyGraphQL} from "../../src/utils/apicall";
import {shopifyCartFormat} from "../../src/utils/dataFormats";


async function createCart(productVariantId) {
    const rawCart = await shopifyGraphQL(
        `mutation {
  cartCreate(
    input: {
      lines: [
        {
          quantity: 1
          merchandiseId: "${productVariantId}"
        }
      ]
    }
  ) {
    cart {
      id
      createdAt
      updatedAt
      lines(first: 10) {
        edges {
          node {
            id
            merchandise {
              ... on ProductVariant {
                id
              }
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
    }
  }
}
`
    )
    const shopifyCart = (await rawCart.json()).data.cartCreate.cart
    console.log(shopifyCart)
    const cart = shopifyCartFormat(shopifyCart)
    return cart
}



// Add products to cart

async function addProductToCart(cartId, productVariantId) {
    // Create Line
    const line = {
        edges: [
            {
                node: {
                    merchandise: {
                        id: productVariantId
                    },
                    quantity: 1
                }
            }
        ]
    }

    // Add line with product Id
    const rawResult = await shopifyGraphQL(`mutation {
            cartLinesAdd(
                cartId: "${cartId}",
                lines: {
                    merchandiseId: "${productVariantId}",
                    quantity: 1
                }
            ) {
                cart {
                    id
                    createdAt
                    updatedAt
                    lines(first: 10) {
                        edges {
                            node {
                                id
                                merchandise {
                                    ... on ProductVariant {
                                        id
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }`)
    const result = await rawResult.json()
    return result.data.cartLinesAdd !== undefined
}

/*
Body :
{
    productId: "",
    cartId
}
 */

export default async function handler(req, res) {
    const productId = (await JSON.parse(req.body)).productId
    let cartId = (await JSON.parse(req.body)).cartId

    if (req.method !== 'POST' || productId === undefined) {
        res.end()
        return {props: {}}
    }

    // Get product variants from req
    const rawProductVariants = await shopifyGraphQL(
        `
        {
            node(id: "gid://shopify/Product/${productId}") {
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
    const productVariantId = (await rawProductVariants.json()).data.node.variants.edges[0].node.id

    // const cartId = localStorage.getItem('cartId')
    // const cartId = "gid://shopify/Cart/2b1630b1c5127af8e447b6ba2d773106"
    // const cartId = undefined

    // Does it have a cart id ?

    if (cartId === undefined) {
        console.log("No cart : Creating one...")
        cartId = (await createCart(productVariantId)).id
    }
    else {
        console.log("Cart id : ", cartId)
        // function to add to cart
        if (await addProductToCart(cartId, productVariantId)) {
            console.log("Line Added !")
        }
    }

    res.json({data: cartId})
}
