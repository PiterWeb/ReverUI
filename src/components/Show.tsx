import { UIComponent } from "../UI";
import { IDGenerator } from "../utils/id";

const ShowIDGenerator = new IDGenerator();

export const $Show = <T extends UIComponent<{}>>({
	when,
	element,
}: {
	when: boolean;
	element: T;
}) => {
	const wrapper = document.createElement("div");

	wrapper.hidden = !when;

	// Triggers smart-render
	if (wrapper.hidden) wrapper.setAttribute("data-rui-show", "false");
	else {
		wrapper.style.display = "contents";
		wrapper.setAttribute("data-rui-show", ShowIDGenerator.generate());
	}

	wrapper.appendChild(element({}));

	return wrapper;
};
