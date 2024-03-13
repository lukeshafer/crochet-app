import { For, createEffect } from "solid-js"
import { createStore, produce } from "solid-js/store"
import { stitches, type CrochetRound } from "../data/patterns"

export default function Create() {
	const [rounds, setRounds] = createStore<Array<Partial<CrochetRound>>>([{}])
	createEffect(() => {
		console.log(rounds[0].sequence?.[0].repeat)
	})

	return (
		<form onSubmit={e => e.preventDefault()} class="p-4">
			<label>
				<p>Name</p>
				<input type="text" class="outline outline-2 outline-amber-700" />
			</label>

			<ul class="grid gap-6 my-6">
				<For each={rounds}>
					{(round, index) => (
						<li class="grid grid-cols-[auto_1fr]">
							<div class="flex gap-2">
								<button
									class="text-red-500 font-bold"
									onClick={() => {
										setRounds(produce(rounds => rounds.splice(index(), 1)))
									}}
								>
									x
								</button>
								<p class="font-bold w-20">Rnd {index() + 1}.</p>
							</div>
							<div class="flex border border-black w-fit">
								<input
									class="w-16 text-right"
									type="number"
									min={1}
									onInput={e =>
										setRounds(
											produce(rounds =>
												rounds[index()].sequence?.splice(index(), 1, {
													...rounds[index()].sequence![index()],
													repeat: Number(e.currentTarget.value),
												}),
											),
										)
									}
								/>
								<select>
									<For each={Object.entries(stitches)}>
										{([stitch]) => <option>{stitch}</option>}
									</For>
								</select>
							</div>
						</li>
					)}
				</For>
			</ul>
			<button
				onClick={() => setRounds(produce(rounds => rounds.push({})))}
				class="bg-amber-200 p-2 py-1 outline outline-1 outline-amber-300"
			>
				Add Round
			</button>
		</form>
	)
}
