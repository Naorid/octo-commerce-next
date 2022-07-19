import {useEffect, useState} from 'react';
import {removeCart} from "../src/components/Header";
import Router, {useRouter} from "next/router";

async function createOrder(id, formData) {
    console.log("id=", id)
    console.log("formData=", formData)

    const rawData = await fetch(`http://localhost:3000/api/createOrder`,
        {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                cartId: id.toString(),
                shippingAddress: {
                    country: "FR"
                }
            })
        })
    console.log("Order=", rawData)
    if (rawData.ok) {
        console.log("OK!")
    }
    // removeCart()
    // await Router.push("/")
}

export default function Page() {
    const router = useRouter()

    useEffect(() => {
        createOrder(sessionStorage.getItem('cartId'), router.query).then()
    }, [router.query])
}