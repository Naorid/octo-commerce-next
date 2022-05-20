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

export async function shopifyGraphQL(content) {
    return await fetch(
        `${process.env.SHOPIFY_DOMAIN}/api/${process.env.API_VERSION}/graphql.json`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/graphql',
                'X-Shopify-Storefront-Access-Token': process.env.STOREFRONT_ACCESS_TOKEN
            },
            body: content
        }
    )
}