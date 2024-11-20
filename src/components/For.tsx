import { UIComponent, UIComponentClass } from "../UI";
import { IDGenerator } from "../utils/id";

const ForIDGenerator = new IDGenerator();

const ForChangeID = ForIDGenerator.generate();
const ForChangeID2 = ForIDGenerator.generate();

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

	// The code never will go into this if
	if (ref === undefined) return document.createElement("template");

	const wrapper = document.createElement("div");
	wrapper.style.display = "contents";

	each.forEach((v, i) => {
		const html = element.bind(ref)({ value: v, index: i });
		wrapper.appendChild(html);
	});

	const lastEach = (ref.__state__.getProp("each-" + element.toString()) ??
		[]) as R;

	const changes =
		each.length !== lastEach.length ||
		lastEach.every((e, i) => JSON.stringify(e) != JSON.stringify(each[i]));

	const lastDataRui = (ref.__state__.getProp(
		"data-rui-for" + element.toString()
	) ?? ForChangeID) as string;

	if (changes)
		wrapper.setAttribute(
			"data-rui-for",
			lastDataRui === ForChangeID ? ForChangeID2 : ForChangeID
		);
	else wrapper.setAttribute("data-rui-for", lastDataRui);

	ref.__state__.setProp(
		"data-rui-for" + element.toString(),
		wrapper.getAttribute("data-rui-for")
	);

	ref.__state__.setProp("each-" + element.toString(), each);

	return wrapper;
};
