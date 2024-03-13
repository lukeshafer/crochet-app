import { createSignal, createMemo, type JSXElement, For } from "solid-js"
import {
	fox,
	stitches,
	type CrochetSequence,
	type CrochetStitch,
} from "../data/patterns"
import Tally from "../components/Tally"

export default function Stitch() {
	const [currentRound, setCurrentRound] = createSignal(0)
	const [roundStitchCount, setRoundStitchCount] = createSignal(0)
	const round = () => fox.rounds[currentRound()]
	const sequenceInfo = createMemo(() =>
		getSequenceInfo(round().sequence, round().repeat || 1),
	)
	const currentStitchName = () =>
		roundStitchCount() === sequenceInfo().count
			? "done"
			: sequenceInfo().modifiedStitchList[roundStitchCount()].stitch

	const markStitchComplete = () => {
		const roundMax = sequenceInfo().count
		if (roundStitchCount() === roundMax) {
			setCurrentRound(r => r + 1)
			setRoundStitchCount(0)
		} else {
			setRoundStitchCount(r => r + 1)
		}
	}

	const handleUndo = () => {
		if (roundStitchCount() === 0) {
			if (currentRound() === 0) return
			const newRoundNumber = Math.max(currentRound() - 1, 0)
			const newRound = fox.rounds[newRoundNumber]
			const newSeqInfo = getSequenceInfo(
				newRound.sequence,
				newRound.repeat || 1,
			)

			setCurrentRound(newRoundNumber)
			setRoundStitchCount(newSeqInfo.count)
			return
		}
		setRoundStitchCount(c => c - 1)
	}

	return (
		<main class="min-h-screen">
			<FinishStitchButton
				markComplete={markStitchComplete}
				stitchName={currentStitchName()}
			>
				<div class="p-10 text-lg text">
					<div class="grid grid-cols-[5rem_1fr_auto] text-left">
						<p class="font-bold">Rnd. {currentRound() + 1} </p>
						<p>
							{sequenceInfo().sequenceString} ({roundStitchCount()} /{" "}
							{sequenceInfo().count * (round().repeat || 1)})
						</p>
						<button
							class="border-[currentColor] border-2 p-1 px-2 text-xs z-10"
							onMouseDown={e => {
								e.stopPropagation()
								handleUndo()
							}}
							onTouchStart={e => e.stopPropagation()}
						>
							Undo
						</button>
					</div>
					<Tallies value={roundStitchCount()} />
				</div>
			</FinishStitchButton>
		</main>
	)
}

function FinishStitchButton(props: {
	markComplete: () => void
	children: JSXElement
	stitchName: CrochetStitch | "done"
}) {
	const [isClicking, setIsClicking] = createSignal(false)

	const handleButton = (button: HTMLButtonElement) => {
		let timeout: number
		button.addEventListener("mousedown", e => {
			e.preventDefault()
			if (
				e.target instanceof HTMLButtonElement &&
				e.target !== e.currentTarget
			) {
				return
			}
			props.markComplete()
			setTimeout(() => {
				setIsClicking(false)
			}, 100)
			setIsClicking(true)
		})

		button.addEventListener("touchstart", e => {
			e.preventDefault()
			if (
				e.target instanceof HTMLButtonElement &&
				e.target !== e.currentTarget
			) {
				return
			}
			timeout = setTimeout(() => {
				props.markComplete()
				setIsClicking(false)
			}, 300)
			setIsClicking(true)
		})

		const endHandler = () => {
			clearTimeout(timeout)
			setIsClicking(false)
		}
		button.addEventListener("touchend", endHandler)
		button.addEventListener("touchcancel", endHandler)
	}

	return (
		<button
			ref={handleButton}
			class="w-full h-full min-h-screen grid grid-rows-[auto_1fr] transition-colors duration-300"
			data-pressed={String(isClicking())}
			classList={{
				"bg-rose-200 data-[pressed=true]:bg-rose-300 text-rose-950":
					props.stitchName === "done",
				"bg-amber-200 data-[pressed=true]:bg-amber-300 text-amber-950":
					props.stitchName === "inc",
				"bg-emerald-200 data-[pressed=true]:bg-emerald-300 text-emerald-950":
					props.stitchName === "sc",
				"bg-violet-200 data-[pressed=true]:bg-violet-300 text-violet-950":
					props.stitchName === "dec",
			}}
		>
			{props.children}
			<span class="grid place-items-center h-full text-7xl">
				{props.stitchName === "done" ? "Done with round!" : props.stitchName}
			</span>
		</button>
	)
}

function getSequenceInfo(sequence: Array<CrochetSequence>, repeat: number) {
	let count = 0
	const modifiedStitchList: Array<{
		index: number
		stitch: CrochetStitch
	}> = []
	const sequenceStringParts: Array<string> = []
	for (const s of sequence) {
		const repeat = s.repeat || 1
		const stitchCount = stitches[s.stitch]
		count += repeat * stitchCount
		for (let r = 0; r < repeat; r++) {
			for (let i = 0; i < stitchCount; i++) {
				modifiedStitchList.push({ index: i, stitch: s.stitch })
			}
		}
		if (s.repeat && s.repeat > 1)
			sequenceStringParts.push(`${s.repeat} ${s.stitch}`)
		else sequenceStringParts.push(s.stitch)
	}

	let sequenceString =
		sequence.length > 1
			? `[${sequenceStringParts.join(", ")}]`
			: sequenceStringParts.join(", ")

	if (repeat > 1) {
		sequenceString += ` x ${repeat}`
	}

	return {
		count,
		sequenceString,
		modifiedStitchList,
	}
}

function Tallies(props: { value: number }) {
	const tallyValues = () => {
		const groups = Math.floor(props.value / 5)
		const rem = (props.value % 5) as 1 | 2 | 3 | 4 | 0

		const t: Array<1 | 2 | 3 | 4 | 5> = []

		for (let i = 0; i < groups; i++) {
			t.push(5)
		}
		if (rem !== 0) {
			t.push(rem)
		}

		return t
	}

	const SIZE = "50"

	return (
		<div class="relative flex items-center flex-wrap justify-center gap-[5px] h-8 max-w-64 mx-auto">
			<For each={tallyValues()}>
				{value => <Tally value={value} width={SIZE} height={SIZE} />}
			</For>
		</div>
	)
}
