import StateStore from "../StateStore";
import deepEqual from "../utils/deep_equal";
import { UIElementProto, UIComponent } from "../UI";
import UI from "../UI";

export interface Signal<t> {
	value: t;
	readonly id: string;
	lastValue: () => t;
	readonly lastValueStringified: string;
}

export function $useSignal<T>(
	el: UIComponent & UIElementProto,
	initvalue: T,
	id: string
): Signal<T> {
	let value = initvalue;
	let state = el.prototype.__state__;
	let elId =  el.prototype.__id__;

	console.log(el.prototype.__state__);

	const keyState = `state-${id}-${elId}`;
	const lastKeyState = `last-${keyState}`;

	if (state === undefined) {
		el.prototype.__state__ = new StateStore();
		state = el.prototype.__state__;
		state.setProp(keyState, value);
	} else if (state.getProp(keyState) === undefined) {
		state.setProp(keyState, value);
	} else value = state.getProp(keyState);

	const setState = (newValue: T) => {
		state.setProp(lastKeyState, value);
		state.setProp(keyState, newValue);

		// Trigger re-render
		const newRender = el();
		UI.setId(newRender, elId);
		state.setProp(`el-${elId}`, newRender);
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
	el: UIComponent & UIElementProto,
	callback: () => void,
	dependencies?: Signal<unknown>[] | string[]
) {

	let elId =  el.prototype.__id__;

	if (dependencies === undefined && el.prototype.__state__ === undefined) {
		return callback();
	}

	if (dependencies !== undefined && el.prototype.__state__ !== undefined) {
		const state = el.prototype.__state__ as StateStore;

		dependencies.forEach((dependency) => {
			if (typeof dependency === "string") {
				const keyState = `state-${dependency}-${elId}`;
				const lastKeyState = `last-${keyState}`;

				const value = state.getProp(keyState);
				const lastValue = state.getProp(lastKeyState);

				if (value === lastValue) return;

				callback();
				return;
			}

			const keyState = `state-${dependency.id}-${elId}`;
			const lastKeyState = `last-${keyState}`;

			const value = state.getProp(keyState);
			const lastValue = state.getProp(lastKeyState);

			if (value === lastValue) return;

			callback();
		});
	}
}
