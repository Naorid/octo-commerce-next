import {shopifyCreateOrder, shopifyGraphQL} from "../../src/utils/apicall";
import {config} from "dotenv"
import * as util from "util";
import {apiRoot, projectKey} from "../../src/utils/commerceToolsConfig";

config()

const commerceToolsMode = `${process.env.PROVIDER}` === 'COMMERCE_TOOLS'
const commerceToolsShippingAddressQuery = (cartVersion, shippingAddress) =>
{
    return {
        version: cartVersion,
        actions: [
            {
                action : "setShippingAddress",
                address : {
                    firstName : `${shippingAddress.firstName}`,
                    lastName : `${shippingAddress.lastName}`,
                    streetName : `${shippingAddress.streetName}`,
                    streetNumber : `${shippingAddress.streetNumber}`,
                    postalCode : `${shippingAddress.postalCode}`,
                    city : `${shippingAddress.city}`,
                    region : `${shippingAddress.region}`,
                    country : `${shippingAddress.country}`,
                    phone : `${shippingAddress.phone}`,
                    email : `${shippingAddress.email}`,
                }
            }
        ]
    }
}

const commerceToolsCustomTypeQuery = (orderVersion, polygram) => {
    return {
        version: orderVersion,
        actions: [
            {
                action : "setCustomType",
                type : {
                    id : "3ee50659-33e7-4b41-ac63-007055fde5fb",
                    typeId : "type"
                },
                fields : {
                    polygramme : polygram
                }
            }
        ]
    }
}

const commerceToolsOrderQuery = (cartVersion, cartId) =>
{
    const  now = new Date()
    return `
{
  "id" : "${cartId}",
  "version" : ${cartVersion},
  "orderNumber" : "${now.getFullYear().toString() + now.getMonth().toString() + now.getDay().toString() +
    now.getHours().toString() + now.getMinutes().toString() + now.getMilliseconds().toString()}"
 }`
}

/*
{
            lineItems: [{ variantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8xMzg3MDQ4MzI3NTc5OA==", quantity: 1 }]
          }
 */

async function shopifyCheckout(req, res) {
    const lineItems = req.body.lineItems
    const lineItemsString = util.inspect({
        lineItems: lineItems
    }).replace(/'/g, '"')
    const call = `
        mutation {
          checkoutCreate(input: ${lineItemsString}) {
            checkout {
               id
               webUrl
               lineItems(first: 5) {
                 edges {
                   node {
                     title
                     quantity
                   }
                 }
               }
            }
          }
        }
    `
    console.log(call)
    const rawCheckout = await shopifyGraphQL(call)
    const checkout = await rawCheckout.json()
    console.log(checkout.data)
    res.json({data: checkout.data})
}

async function shopifyOrder(req, res) {
    const cartId = req.body.cartId

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

    const line_items = shopifyCart.lines.edges.map(e => {
        return {
            variant_id: parseInt(e.node.merchandise.id.split('/')[4]),
            quantity: e.node.quantity
        }
    })

    console.log("line_items=", line_items)

    const body = {
        order: {
            line_items: line_items
        }
    }
    console.log(body)
    console.log(body.order.line_items[0])

    const rawOrder = await shopifyCreateOrder(JSON.stringify(body))

    console.log(rawOrder)

    const order = await rawOrder.json()

    console.log(order)

    res.end()
}

async function commerceToolsOrder(req, res) {
    const cartId = req.body.cartId
    const shippingAddress = req.body.shippingAddress
    const delivery_man = req.body.delivery_man

    // Get cart version

    let cartVersion = await apiRoot
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
            res.status(400).json(e);
        })

    // Update cart to add shippingAddress

    console.log("Bonjour")

    await apiRoot
        .withProjectKey({ projectKey })
        .carts()
        .withId({ID: cartId.toString()})
        .post({
            body: commerceToolsShippingAddressQuery(cartVersion, shippingAddress)
        })
        .execute()
        .then(async result => {
            console.log("cart", result)
            // console.log(cart)
            return result.body
        })
        .catch(e => {
            console.error(e);
            res.status(400).json(e);
        })

    // Create order from cart

    cartVersion = await apiRoot
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
            res.status(400).json(e);
        })

    console.log("Bonjour2")
    console.log(cartId)

    const order = await apiRoot
        .withProjectKey({ projectKey })
        .orders()
        .post({
            body: commerceToolsOrderQuery(cartVersion, cartId)
        })
        .execute()
        .then(result => {
            console.log("order", result)
            const rawResult = result.body;
            console.log(rawResult)
            return {
                id: result.body.id,
                version: result.body.version
            }
        })
        .catch(e => {
            console.error(e);
            res.status(400).json(e);
        })

    // Set Octo order custom type

    await apiRoot
        .withProjectKey({ projectKey })
        .orders()
        .withId({ID: order.id})
        .post({
            body: commerceToolsCustomTypeQuery(order.version, delivery_man)
        })
        .execute()
        .then(result => {
            console.log("order", result)
            const rawResult = result.body;
            console.log(rawResult)
        })
        .catch(e => {
            console.error(e);
            res.status(400).json(e);
        })

    return res
}

export default async function handler(req, res) {
    if (commerceToolsMode) {
        res = await commerceToolsOrder(req, res)
        res.status(200)
        res.end()
        return res
    } else {
        return await shopifyOrder(req, res)
    }
}
