import { UIComponent } from "../UI";
import { IDGenerator } from "../utils/id";

const ForIDGenerator = new IDGenerator();

export const $For = <
	T extends UIComponent<{ index: number; value: R[number] }>,
	R extends unknown[]
>({
	element,
	each,
}: {
	element: T;
	each: R;
}) => {
	const wrapper = document.createElement("div");
	wrapper.style.display = "contents"

	each.forEach((v, i) => {
		const html = element({ value: v, index: i });
		wrapper.appendChild(html);
	});

	wrapper.setAttribute("data-rui-for", ForIDGenerator.generate());

	return wrapper;
};
