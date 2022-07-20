import {Box, Button, Container, Heading, Text, Image, Link, Select} from "@chakra-ui/react";

export function removeCart() {
    sessionStorage.removeItem('cartId')
}

export function setUser(e) {
    const user = document.getElementById('client-dropdown').value;
    sessionStorage.setItem("user", user);
}

function Header() {
    return (
        <Container>
            <Box></Box>
            <div className="menu-principal" style={{display: "flex", alignItems: "center" }}>
                <Select id="client-dropdown" maxWidth={"fit-content"} color={"black"} >
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
                <Button bgColor={"#00b0cb"} type="submit" onClick={setUser}>Connexion</Button>
                <Link href='http://127.0.0.1:5500/octobook-delivery/front/landing.html'>Commandes</Link>
            </div>
            <img src="/assets/octobook.png" alt="" id="octobook"></img>
            <Button bgColor={"#00b0cb"} onClick={() => removeCart()}>Remove Cart</Button>
        </Container>
    )
}

export default Header