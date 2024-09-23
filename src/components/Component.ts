import { UIComponent, UIComponentClass } from "../UI";

export const $Component = <
	T extends UIComponent<P>,
	P extends Record<string, unknown>
>({
	element,
	ref,
	props,
}: {
	element: T;
	props?: P;
	ref?: UIComponentClass;
}) => {
	return element.bind(ref)(props ?? ({} as P));
};