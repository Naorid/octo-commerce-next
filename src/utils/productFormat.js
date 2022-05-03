export const shopifyFormat = (product) => {
    return {
        id: product.id,
        title: product.title,
        image: product.image.src
    }
}
