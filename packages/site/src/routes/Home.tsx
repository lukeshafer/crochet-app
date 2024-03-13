import { For, Show, createMemo } from "solid-js"
import {
	fox,
	type CrochetRound,
	type CrochetSequence,
	stitches,
} from "../data/patterns"

export default function Home() {
	return (
		<main>
			<ul class="m-4 grid gap-2">
				<For each={fox.rounds}>
					{(round, index) => <RoundDisplay round={round} index={index()} />}
				</For>
			</ul>
		</main>
	)
}

function RoundDisplay(props: {
	round: CrochetRound
	index: number
}) {
	const sequenceData = createMemo(() => getSequenceInfo(props.round.sequence))
	const seqRepeat = () => props.round.repeat || 1

	return (
		<li class="grid grid-cols-[auto_1fr]">
			<p class="font-bold w-20">Rnd {props.index + 1}.</p>
			<div>
				{props.round.sequence.length > 1
					? `[${sequenceData().sequenceString}]`
					: sequenceData().sequenceString}{" "}
				<Show when={seqRepeat() > 1}> x {seqRepeat()} </Show>(
				{sequenceData().count * seqRepeat()})<p>{props.round.notes}</p>
			</div>
		</li>
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
