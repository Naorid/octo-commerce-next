import {shopifyGraphQL} from "../../src/utils/apicall";
import {config} from "dotenv"
import * as util from "util";

config()

/*
{
            lineItems: [{ variantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8xMzg3MDQ4MzI3NTc5OA==", quantity: 1 }]
          }
 */

export default async function handler(req, res) {
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