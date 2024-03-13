import { splitProps } from "solid-js"
import type { JSX } from "solid-js/jsx-runtime"

export default function Tally(
	props: {
		value: keyof typeof tallies
	} & JSX.SvgSVGAttributes<SVGSVGElement>,
) {
	const [base, svg] = splitProps(props, ["value", "width", "height"])

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={base.width || "1em"}
			height={base.height || "1em"}
			viewBox="0 0 24 24"
			{...svg}
		>
			<path
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d={tallies[base.value]}
			/>
		</svg>
	)
}

const tallies = {
	1: "M4 4v16",
	2: "M4 4v16M9 4v16",
	3: "M4 4v16M9 4v16m5-16v16",
	4: "M4 4v16M9 4v16m5-16v16m5-16v16",
	5: "M4 4v16M9 4v16m5-16v16m5-16v16m3-14L2 18",
}
