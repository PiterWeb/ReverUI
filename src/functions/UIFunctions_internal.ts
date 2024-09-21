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

	const keyState = `state-${id}`;
	const lastKeyState = `last-${keyState}`;

	if (state === undefined) {
		el.__state__ = new StateStore();
		state = el.__state__;
		state.setProp(keyState, value);
	} else if (state.getProp(keyState) === undefined) {
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
	dependencies?: Signal<unknown>[] | string[]
) {
	const state = el.__state__ as StateStore | undefined;
	if (dependencies === undefined && state === undefined) {
		return callback();
	}

	if (dependencies !== undefined && state !== undefined) {
		dependencies.forEach((dependency) => {
			if (typeof dependency === "string") {
				const keyState = `state-${dependency}`;
				const lastKeyState = `last-${keyState}`;

				const value = state.getProp(keyState);
				const lastValue = state.getProp(lastKeyState);

				if (value === lastValue) return;

				callback();
				return;
			}

			const keyState = `state-${dependency.id}`;
			const lastKeyState = `last-${keyState}`;

			const value = state.getProp(keyState);
			const lastValue = state.getProp(lastKeyState);

			if (value === lastValue) return;

			callback();
		});
	}
}
