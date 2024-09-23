import StateStore from "../StateStore";
import deepEqual from "../utils/deep_equal";
import { UIComponentClass } from "../UI";

export interface Signal<t> {
	value: t;
	readonly id: string;
	lastValue: () => t;
	readonly lastValueStringified: string;
}

export function $useSignal<T>(
	el: UIComponentClass,
	initvalue: T,
	id: string
): Signal<T> {
	let value = initvalue;
	let state = el.__state__;

	const keyState = `state-${id}-${el.__id__}`;
	const lastKeyState = `last-${keyState}`;

	if (state.getProp(keyState) === undefined) {
		state.setProp(keyState, value);
	} else value = state.getProp(keyState);

	const setState = (newValue: T) => {
		state.setProp(lastKeyState, value);
		state.setProp(keyState, newValue);

		// Trigger re-render
		const newRender = el.render();

		state.setProp("el", newRender);
	};

	return {
		get value() {
			return state.getProp(keyState);
		},
		lastValue() {
			return state.getProp(lastKeyState);
		},
		get lastValueStringified() {
			return JSON.stringify(this.lastValue());
		},
		set value(newValue: T) {
			const value = this.value;
			if (newValue === value || deepEqual(newValue, value)) return;
			setState(newValue);
		},
		id,
	};
}

export function $useEffect(
	el: UIComponentClass,
	callback: () => void,
	dependencies: Signal<unknown>[],
	id: string
) {
	const state = el.__state__;

	const initialized = state.getProp(`effect-${id}`) !== undefined;

	if (initialized) return;

	// Set initialized as true
	state.setProp(`effect-${id}`, true);

	if (dependencies.length == 0) return callback();

	dependencies.forEach((dependency) => {
		const keyState = `state-${dependency.id}-${el.__id__}`;

		let lastValue: unknown;

		state.addListener(keyState, (newValue) => {
			if (newValue === lastValue) return;
			lastValue = state.getProp(keyState);

			callback();
		});
	});
}
