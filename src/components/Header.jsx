import {Box, Button, Container, Heading, Text, Image, Link, Select} from "@chakra-ui/react";
import {useEffect, useState} from "react";

export function removeCart() {
    sessionStorage.removeItem('cartId')
}

export function setUser(e) {
    const user = document.getElementById('client-dropdown').value;
    sessionStorage.setItem("user", user);
}

function Header() {
    const [shopifyMode, setShopifyMode] = useState(true)

    useEffect(() => {
        fetch(`http://localhost:3000/api/shopifyMode`)
            .then(data => data.json())
            .then(data => setShopifyMode(data.data))
    }, [])

    return (
        <Container>
            {!shopifyMode ? <Box>
                <div className="menu-principal" style={{
                    display: "-webkit-inline-box",
                    position: "absolute",
                    top: "5px",
                    right: "50px" }}>
                    <Select id="client-dropdown" maxWidth={"fit-content"} color={"black"} bgColor={"white"} margin={"5px"}>
                        <option value="AHU">AHU</option>
                        <option value="NATH">NATH</option>
                        <option value="LJA">LJA</option>
                        <option value="DORO">DORO</option>
                        <option value="MACA">MACA</option>
                        <option value="MALA">MALA</option>
                        <option value="MIRI">MIRI</option>
                        <option value="LCI">LCI</option>
                        <option value="SHAM">SHAM</option>
                        <option value="GIRE">GIRE</option>
                        <option value="MOLY">MOLY</option>
                        <option value="CLAG">CLAG</option>
                        <option value="LAWA">LAWA</option>
                        <option value=""></option>
                    </Select>
                    <Button bgColor={"#00b0cb"} type="submit" onClick={setUser} margin={"5px"}>Connexion</Button>
                    <br />
                    <Link href='http://127.0.0.1:5500/octobook-delivery/front/landing.html'>Commandes</Link>
                    <br />
                    <Button bgColor={"#00b0cb"} onClick={() => removeCart()}>Input</Button>
                </div>
            </Box>
                : <div></div>}
            <img src="/assets/octobook.png" alt="" id="octobook"></img>
        </Container>
    )
}

export default Header