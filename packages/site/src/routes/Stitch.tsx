import { type JSX, createSignal, createMemo } from "solid-js"
import { fox, stitches, type CrochetSequence } from "../data/patterns"

export default function Stitch() {
	const [currentRound, setCurrentRound] = createSignal(0)
	const [roundStitchCount, setRoundStitchCount] = createSignal(0)
	const round = () => fox.rounds[currentRound()]
	const sequenceInfo = createMemo(() => getSequenceInfo(round().sequence))

	const markStitchComplete = () => {
		const roundMax = sequenceInfo().count
		if (roundStitchCount() === roundMax - 1) {
			setCurrentRound(r => r + 1)
			setRoundStitchCount(0)
		} else {
			setRoundStitchCount(r => r + 1)
		}
	}

	return (
		<main class="min-h-screen grid grid-rows-[auto_1fr]">
			<div class="min-h-80 p-10">
				<p class="text-lg text-center font-bold">Rnd. {currentRound() + 1} </p>
				<p>{sequenceInfo().count}</p>
				<Tally value={roundStitchCount()} />
			</div>
			<button
				onClick={() => markStitchComplete()}
				class="w-full h-full bg-amber-200"
			>
				Stitch Done
			</button>
		</main>
	)
}

function getSequenceInfo(sequence: Array<CrochetSequence>) {
	let count = 0
	const sequenceStringParts: Array<string> = []
	for (const s of sequence) {
		const repeat = s.repeat || 1
		const stitchCount = stitches[s.stitch]
		count += repeat * stitchCount
		if (s.repeat && s.repeat > 1)
			sequenceStringParts.push(`${s.repeat} ${s.stitch}`)
		else sequenceStringParts.push(s.stitch)
	}

	return {
		count,
		sequenceString: sequenceStringParts.join(", "),
	}
}

function Tally(props: { value: number }) {
	const slashes = () => {
		let marks: Array<JSX.Element> = []
		const groups: Array<JSX.Element> = []
		for (let i = 0; i < props.value; i++) {
			if (i % 5 === 4) {
				groups.push(
					<div class="relative flex gap-[5px] mr-2 h-full">
						{[...marks, <TallySlash diagonal />]}
					</div>,
				)
				marks = []
			} else {
				marks.push(<TallySlash />)
			}
		}
		return [...groups, marks]
	}

	return (
		<div class="relative flex items-center flex-wrap justify-center gap-[5px] h-8 max-w-64 bg-lime-500 mx-auto">
			{slashes()}
		</div>
	)
}

function TallySlash(props: { diagonal?: boolean }) {
	return (
		<span
			class="inline-block w-[2px] bg-black"
			classList={{
				"absolute rotate-45 origin-top-right top-0 -right-1 h-[140%]":
					props.diagonal,
				"h-full": !props.diagonal,
			}}
		></span>
	)
}
