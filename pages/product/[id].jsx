import React, {useEffect, useState} from 'react'
import { useRouter} from 'next/router';
import { Router } from 'next/router'
import Link from "next/link";

export default () => {
    const router = useRouter()
    const { id } = router.query

    const [product, setProduct] = useState([])

    useEffect( () => {
        if (!router.isReady) return
        fetch(`http://localhost:3000/api/product/${id}`)
            .then(response => response.json())
            .then(data => console.log(data.data) & setProduct(data.data))
    }, [])

    return (
        <div>
            <h1>Product: id={id}</h1>

            <p>Name: {product.name}</p>

            <Link href="/">
                <a>Home</a>
            </Link>
        </div>
    )
}
