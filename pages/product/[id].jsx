import React from 'react'
import { useRouter} from 'next/router';
import Link from "next/link";
import Image from "next/image";

export async function getServerSideProps(context) {
    const rawProduct = await fetch(`http://localhost:3000/api/product/${context.query.id}`)
    if (!rawProduct.ok) {
        return {props: {}}
    }
    const productJson = await rawProduct.json()
    const product = productJson.data

    return {
        props: {product}
    }
}

export default function Page({ product }) {
    const router = useRouter()
    const { id } = router.query

    return (
        <div>
            <h1>Product: id={id}</h1>
            <p>Title: {product.title}</p>

            <img width="300" height="300" src={product.image}></img>

            <Link href="/">
                <a>Home</a>
            </Link>
        </div>
    )
}
