import { IDGenerator } from "../utils/id";
import { $Component } from "./Component";

const ShowIDGenerator = new IDGenerator()

export const $Show = <T extends typeof $Component | HTMLElement>({
	when,
}: {
	when: boolean;
	children: T;
}) => {

	const div = document.createElement("div");

    // Triggers smart-render
	div.setAttribute("data-rui-show", ShowIDGenerator.generate());

    div.hidden = !when

    return div
};
