export async function shopifyCall(endpoint) {
    return await fetch(
        `${process.env.SHOPIFY_DOMAIN}/admin/api/${process.env.API_VERSION}/${endpoint}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': process.env.ACCESS_TOKEN
            }
        }
    )
}