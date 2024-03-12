/* @refresh reload */
import { render } from "solid-js/web"

import "./index.css"
import Root from "./root"

const root = document.getElementById("root")
if (!root) {
	throw new Error("App root not found")
}

render(() => <Root />, root)
