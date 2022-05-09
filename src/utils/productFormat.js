export const shopifyFormat = (product) => {
    return {
        id: product.id,
        title: product.title,
        image: product.image.src,
        price: product.variants[0].price,
        description: product.body_html
    }
}
