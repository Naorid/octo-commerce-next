import React, {useEffect, useState} from 'react'
import Link from "next/link";

export default () => {
    const [products, setProducts] = useState([])

    useEffect( () => {
        fetch(`http://localhost:3000/api/products`)
            .then(response => response.json())
            .then(data => console.log(data.data) & setProducts(data.data))
    }, [])

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
