import React from 'react'
import Link from "next/link";

export async function getServerSideProps(context) {
    const rawProducts = await fetch(`http://localhost:3000/api/products`)
    if (!rawProducts.ok) {
        return {props: {}}
    }
    const products = (await rawProducts.json()).data

    return {
        props: {products}
    }
}

export default function Page({ products }) {
    return (
        <div>
            <h1>Index Page</h1>

            {products.map(product => (
                <div key={product.id}>
                    <Link href="/product/[id]" as={`/product/${product.id}`}>
                        <a>
                            <strong>{product.title}</strong>
                        </a>
                    </Link>
                </div>
            ))}
        </div>
    )
}
