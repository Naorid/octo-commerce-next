export const shopifyProductFormat = (product) => {
    return {
        id: product.id,
        name: product.title,
        image: product.image.src,
        price: product.variants[0].price,
        compare_at_price: product.variants[0].compare_at_price,
        description: product.body_html
    }
}

export const shopifyCartFormat = (cart) => {
    return {
        id: cart.id,
        lines: cart.lines,
        estimated_cost: cart.estimatedCost
    }
}