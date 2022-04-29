import React from 'react'
import Link from "next/link";

export default () => {
    const products = new Array(15).fill(1).map((e, i) => ({id: i, name: `Product: ${i}`}))

    return (
        <div>
            <h1>Index Page</h1>

            {products.map(product => (
                <div>
                    <Link key={product.id} href="/product/[id]" as={`/product/${product.id}`}>
                        <a>
                            <strong>{product.name}</strong>
                        </a>
                    </Link>
                </div>
            ))}
        </div>
    )
}
