export const shopifyFormat = (product) => {
    return {
        id: product.id,
        name: product.title,
        image: product.image.src,
        price: product.variants[0].price,
        compare_at_price: product.variants[0].compare_at_price,
        description: product.body_html
    }
}
