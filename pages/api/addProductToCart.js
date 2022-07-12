import {shopifyGraphQL} from "../../src/utils/apicall";
import {shopifyCartFormat} from "../../src/utils/dataFormats";
import {config} from "dotenv";
import {apiRoot, projectKey} from "../../src/utils/commerceToolsConfig";

config()

const commerceToolsMode = `${process.env.PROVIDER}` === 'COMMERCE_TOOLS'
const commerceToolsVariantQuery = (productId) => `
    query {
  product(id: "${productId}") {
    id
      masterData {
        current {
          name(locale:"FR")
          masterVariant {
             id
          }
        }
      }
  }
}

`
const commerceToolsCreateCartQuery = (productId, variantId) => `
{
  "currency" : "EUR",
  "country": "FR",
  "customerGroup": {
      "id": "bce97418-5d75-46f4-ba35-e6065217b041"
  },
  "lineItems": [
      {
          
          "productId": "${productId}",
          "variant": {
              "id": "${variantId}"
          },
          "quantity": 1,
          "supplyChannel": {
              "id": "e5c09527-68cf-4b03-be51-7410d491a666"
          },
          "distributionChannel": {
              "id": "e5c09527-68cf-4b03-be51-7410d491a666"
          }
      }
  ]
}`
const commerceToolsAddProductQuery = (productId) => `
{
  "version" : 1,
  "actions" : [ {
    "action" : "addLineItem",
    "productId" : "${productId}",
    "variantId" : 1,
    "quantity" : 1,
    "supplyChannel": {
      "id": "e5c09527-68cf-4b03-be51-7410d491a666"
  },
  "distributionChannel": {
      "id": "e5c09527-68cf-4b03-be51-7410d491a666"
  }
  } ]
}`

async function shopifyCreateCart(productVariantId) {
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
    return shopifyCartFormat(shopifyCart)
}

async function commerceToolsCreateCart(productId, productVariantId) {
    return await apiRoot
        .withProjectKey({ projectKey })
        .carts()
        .post({
            body: commerceToolsCreateCartQuery(productId, productVariantId)
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
            console.error(e)
        })
}

async function createCart(productVariantId) {
    if (!commerceToolsMode) {
        return shopifyCreateCart(productVariantId)
    } else {
        return commerceToolsCreateCart(productVariantId)
    }
}



// Add products to cart

async function shopifyAddProductToCart(cartId, productVariantId) {
    const rawResult = await shopifyGraphQL( `mutation {
            cartLinesAdd(
                cartId: "gid://shopify/Cart/${cartId}",
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
    console.log('addProductToCartResult=', result)
    return result.data !== undefined && result.data.cartLinesAdd !== undefined
}

async function commerceToolsAddProductToCart(cartId, productId, productVariantId) {
    return await apiRoot
        .withProjectKey({ projectKey })
        .carts()
        .withId({ID: cartId.toString() })
        .post({
            body: commerceToolsAddProductQuery(productId)
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

async function addProductToCart(cartId, productId, productVariantId) {
    // Add line with product Id
    if (!commerceToolsMode) return await shopifyAddProductToCart(cartId, productVariantId)
    return await commerceToolsAddProductToCart(cartId, productId, productVariantId)
}

async function shopifyGetProductVariant(productId) {
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
    return (await rawProductVariants.json()).data.node.variants.edges[0].node.id
}

async function commerceToolsGetProductVariant(productId) {
    console.log("Yo")
    console.log(productId)
    return await apiRoot
        .withProjectKey({ projectKey })
        .graphql()
        .post({
            body: { query: commerceToolsVariantQuery(productId) }
        })
        .execute()
        .then(result => {
            const rawResult = result.body.data.product;
            console.log("rawResult=", rawResult.id)
            return rawResult.id
        })
        .catch(e => {
            // console.error(e);
            console.error(e)
        })
}

async function getProductVariant(productId) {
    if (!commerceToolsMode) return await shopifyGetProductVariant(productId)
    return await commerceToolsGetProductVariant(productId)
}

/*
Body :
{
    productId: "",
    cartId
}
 */

export default async function handler(req, res) {
    console.log("Bonjour")
    const productId = req.body.productId //(await JSON.parse(req.body)).productId

    let cartId = req.body.cartId //(await JSON.parse(req.body)).cartId
    if (req.method !== 'POST' || productId === undefined) {
        res.end()

        return {props: {}}
    }
    console.log("Bonjour")
    // Get product variants from req
    const productVariantId = await getProductVariant(productId)
    console.log("productVariantId", productVariantId)
    // const cartId = .getItem('cartId')
    // const cartId = "gid://shopify/Cart/2b1630b1c5127af8e447b6ba2d773106"
    // const cartId = undefined

    // Does it have a cart id ?

    if (cartId === undefined || cartId === "undefined" || cartId === 'null') {
        console.log("No cart : Creating one...")
        cartId = (await createCart(productVariantId)).id.toString()
    }
    else {
        console.log("Cart id : ", cartId)
        // function to add to cart
        if (await addProductToCart(cartId, productId, productVariantId)) {
            console.log("Line Added !")
        }
        if (!commerceToolsMode) {
            cartId = `gid://shopify/Cart/${cartId}`
        }
    }

    res.json({data: cartId})
}
