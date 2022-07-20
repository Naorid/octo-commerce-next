import {config} from "dotenv";

config()


const commerceToolsMode = `${process.env.PROVIDER}` === 'COMMERCE_TOOLS'


export default async function handler(req, res) {
    res.json({data: !commerceToolsMode})
    res.end()
}
