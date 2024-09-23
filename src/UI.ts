import StateStore from "./StateStore";
import { UIGenerateId } from "./utils/id";

type UIElementArgs = Record<string, any>;

type children =
	| (string | number | boolean | HTMLElement)[]
	| (string | number | boolean | HTMLElement)[][];

export type UIComponent<T extends Record<string, unknown> = UIElementArgs> = (
	args: T
) => HTMLElement;

export class UIComponentClass {
	__id__ = UIGenerateId();
	__state__: StateStore = new StateStore();

	private elementFn: UIComponent;

	constructor(elementFn: UIComponent) {
		this.elementFn = elementFn;
	}

	render(args?: UIElementArgs) {
		const element = this.elementFn(args ?? {});
		UI.setId(element, this.__id__);
		return element;
	}
}

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
	ref: UIComponentClass;
}) => {
	return element.bind(ref)(props ?? ({} as P));
};

export function $UI(component: UIComponent, parent?: HTMLElement | null) {
	UI.HandleStateFull(component as UIComponent, parent);
}

export default class UI {
	public static renderString(elementFun: UIComponent): string {
		return elementFun({}).outerHTML;
	}

	public static createElement(
		tagName: string | UIComponent,
		opts?: UIElementArgs,
		...children: children
	): HTMLElement {
		// Component
		if (typeof tagName === "function") {
			
			const component = new UIComponentClass(tagName);
			const el = component.render(opts);
			UI.createChilds(el, children);

			return el;
		}

		let el = document.createElement(tagName);

		if (tagName === "Fragment")
			el = document.createDocumentFragment() as unknown as HTMLElement;

		if (opts) {
			const keys = Object.keys(opts);

			for (const key of keys) {
				if (opts[key] === undefined) continue;
				// @ts-ignore
				el[key] = opts[key];

				if (
					el.getAttribute(key) != opts[key] &&
					!key.startsWith("on") &&
					key != "className"
				)
					el.setAttribute(key, opts[key]);

				// if (key.startsWith("data-")) el.setAttribute(key, opts[key]);
			}
		}

		UI.createChilds(el, children);

		return el;
	}

	private static createChilds(parent: HTMLElement, children: children) {
		for (const child of children) {
			if (typeof child === "string")
				parent.appendChild(document.createTextNode(child));

			if (typeof child === "number" || typeof child === "boolean")
				parent.appendChild(document.createTextNode(child.toString()));

			if (child instanceof HTMLElement) {
				parent.appendChild(child);
			}

			if (child instanceof DocumentFragment) {
				parent.appendChild(child);
			}

			// {array.map((el) => {return <div>{el}</div>})
			if (child instanceof Array) {
				this.createChilds(parent, child);
			}
		}
	}

	public static Fragment = "Fragment";

	static setId(el: HTMLElement, id: string) {
		if (el instanceof DocumentFragment) return;
		el.setAttribute("data-fr-id", id);

		for (let i = 0; i < el.children.length; i++) {
			const child = el.children.item(i);

			if (child === null) continue;

			if (child.hasChildNodes()) this.setId(child as HTMLElement, id);
		}
	}

	static getId(el: HTMLElement) {
		return el.getAttribute("data-fr-id");
	}

	private static smartRerender(
		parent: HTMLElement,
		actualElement: HTMLElement,
		newElement: HTMLElement
	) {
		// Search actual element in parent, then search for changes in itself and in children recursively

		// If not found, return

		// If found, replace with new element, using replaceWith function

		// console.log(actualElement,newElement)

		for (let i = 0; i < parent.children.length; i++) {
			const child = parent.children.item(i);
			if (child === null) continue;
			if (
				child.getAttribute("data-fr-id") ===
					actualElement.getAttribute("data-fr-id") &&
				child.tagName === newElement.tagName &&
				// @ts-ignore
				child["uid"] === newElement["uid"] &&
				child.getAttribute("key") === newElement.getAttribute("key")
			) {
				for (let j = 0; j < newElement.attributes.length; j++) {
					const newChildAttribute = newElement.attributes.item(j);

					if (newChildAttribute === null) continue;

					if (!newChildAttribute.name.startsWith("data-rui-"))
						continue;

					for (let k = 0; k < child.attributes.length; k++) {
						const childAttribute = child.attributes.item(k);

						if (childAttribute === null) continue;

						if (childAttribute.name === newChildAttribute.name) {
							if (
								childAttribute.value !== newChildAttribute.value
							) {
								child.replaceWith(newElement);
								return;
							}
						}
					}

					child.replaceWith(newElement);
				}

				// Search for changes in children recursively

				for (let j = 0; j < child.children.length; j++) {
					const childChild = child.children.item(j);
					const newChildChild = newElement.children.item(j);
					if (childChild === null || newChildChild === null) continue;
					this.smartRerender(
						child as HTMLElement,
						childChild as HTMLElement,
						newChildChild as HTMLElement
					);
				}
			} else if (child.hasChildNodes()) {
				this.smartRerender(
					child as HTMLElement,
					actualElement,
					newElement
				);
			}
		}
	}

	private static handleFragmentRerender(
		parent: HTMLElement,
		newElement: HTMLElement,
		id: string
	) {
		if (!(newElement instanceof DocumentFragment)) return;

		let firstFragmentChild: Element | null = null;

		for (let i = 0; i < parent.children.length; i++) {
			const child = parent.children.item(i);
			if (child === null) continue;
			if (child.getAttribute("data-fr-id") === id) {
				parent.insertBefore(newElement, child);
				firstFragmentChild = child;
				break;
			}
		}

		if (firstFragmentChild === null) return;

		let nextSibling = firstFragmentChild.nextSibling;
		firstFragmentChild.remove();

		while (nextSibling !== null) {
			const next = nextSibling.nextSibling;
			parent.removeChild(nextSibling);
			nextSibling = next;
		}
	}

	public static HandleStateFull(
		elementFun: UIComponent,
		parent?: HTMLElement | null
	) {
		const component = new UIComponentClass(elementFun);
		const id = component.__id__;

		let actualElement = component.render();

		if (!parent) parent = document.body;

		parent.appendChild(actualElement);

		component.__state__.addListener("el", (newElement: HTMLElement) => {
			if (this.getId(newElement) !== id) return;

			this.handleFragmentRerender(parent, newElement, id);

			if (!(newElement instanceof DocumentFragment)) {
				this.smartRerender(parent, actualElement, newElement);
			}

			//@ts-ignore
			actualElement = newElement;
		});
	}

	public static HandleStateLess(
		elFun: () => HTMLElement,
		parent: HTMLElement
	) {
		parent.appendChild(elFun());
	}
}
