import { splitProps, type JSX } from "solid-js"

export default function UndoIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
	const [base, svg] = splitProps(props, ["width", "height"])

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={base.width || "1em"}
			height={base.height || "1em"}
			viewBox="0 0 24 24"
			{...svg}
		>
			<path
				fill="currentColor"
				d="M20 10H7.815l3.587-3.586L10 5l-6 6l6 6l1.402-1.415L7.818 12H20a6 6 0 0 1 0 12h-8v2h8a8 8 0 0 0 0-16"
			/>
		</svg>
	)
}
