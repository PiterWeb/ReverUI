import { UIComponent, UIComponentClass } from "../UI";
import { IDGenerator } from "../utils/id";

const ShowIDGenerator = new IDGenerator();

const ShowID = ShowIDGenerator.generate();
const ShowID2 = ShowIDGenerator.generate();

export const $Show = <T extends UIComponent<{}>>({
	when,
	element,
	ref,
}: {
	when: boolean;
	element: T;
	ref?: UIComponentClass;
}) => {
	// The code never will go into this if
	if (ref === undefined) return document.createElement("template");

	const wrapper = document.createElement("div");

	wrapper.hidden = !when;

	const lastDataRui = (ref.__state__.getProp(
		"data-rui-show-" + element.toString()
	) ?? ShowID) as string;

	// Triggers smart-render
	if (wrapper.hidden) wrapper.setAttribute("data-rui-show", "false");
	else {
		wrapper.style.display = "contents";
		wrapper.setAttribute(
			"data-rui-show",
			lastDataRui === ShowID ? ShowID2 : ShowID
		);
	}

	ref.__state__.setProp(
		"data-rui-show-" + element.toString(),
		wrapper.getAttribute("data-rui-show")
	);

	wrapper.appendChild(element.bind(ref)({}));

	return wrapper;
};
