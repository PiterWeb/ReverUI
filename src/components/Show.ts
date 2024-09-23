import { $Component } from "./Component";

export const $Show = <T extends typeof $Component | HTMLElement>({
	when,
}: {
	when: boolean;
	children: T;
}) => {

	const div = document.createElement("div");

    // Triggers smart-render
	div.setAttribute("data-rui-show", when.toString());

    div.hidden = !when

    return div
};
