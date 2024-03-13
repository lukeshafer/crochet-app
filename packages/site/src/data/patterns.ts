export type CrochetPattern = {
	name: string
	rounds: Array<CrochetRound>
}

export type CrochetRound = {
	repeat?: number
	notes?: string
	sequence: Array<CrochetSequence>
}

export type CrochetSequence = {
	stitch: CrochetStitch
	repeat?: number
}

export type CrochetStitch = keyof typeof stitches
export const stitches = {
	sc: 1,
	inc: 2,
	dec: 1,
} as const

export const fox: CrochetPattern = {
	name: "woobles-fox",
	rounds: [
		{
			notes: "Start 6 sc in a magic loop",
			sequence: [{ stitch: "sc", repeat: 6 }],
		},
		{ sequence: [{ stitch: "inc", repeat: 6 }] },
		{ sequence: [{ stitch: "dec" }, { stitch: "inc" }], repeat: 6 },
	],
}
