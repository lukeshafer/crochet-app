/* @refresh reload */
import { render } from "solid-js/web"

import "./index.css"
//import Home from "./routes/Home"
//import Create from "./routes/Create"
import Stitch from "./routes/Stitch"

const root = document.getElementById("root")
if (!root) {
	throw new Error("App root not found")
}

render(() => <Stitch />, root)
