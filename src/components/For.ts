import { UIComponent, UIComponentClass } from "../UI";
import { IDGenerator } from "../utils/id";

const ForIDGenerator = new IDGenerator();

export const $For = <
	T extends UIComponent<{ index: number; value: R[number] }>,
	R extends unknown[]
>({
	element,
	each,
	ref,
}: {
	element: T;
	each: R;
	ref?: UIComponentClass;
}) => {
	const container = document.createElement("div");

	each.forEach((v, i) => {
		const html = element.bind(ref)({ value: v, index: i });

		container.appendChild(html);
	});

	container.setAttribute("data-rui-for", ForIDGenerator.generate());

	return container;
};
