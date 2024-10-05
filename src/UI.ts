import StateStore from "./StateStore";
import { WritablePart } from "./types";
import { IDGenerator } from "./utils/id";

export type UIElementArgs = Record<string, any>;

type children =
	| (string | number | boolean | HTMLElement | DocumentFragment)[]
	| (string | number | boolean | HTMLElement | DocumentFragment)[][];

export type UIComponent<T extends UIElementArgs = UIElementArgs> = (
	args: T
) => HTMLElement;

export class UIComponentClass {
	static IDGenerator = new IDGenerator();

	__id__ = UIComponentClass.IDGenerator.generate();
	__state__: StateStore = new StateStore();

	private elementFn: UIComponent;

	constructor(elementFn: UIComponent) {
		this.elementFn = elementFn;
	}

	render(args?: Parameters<typeof this.elementFn>[0]) {
		const element = this.elementFn(args ?? {});
		UI.setId(element, this.__id__);
		return element;
	}
}

export function $UI(
	component: UIComponent,
	parent?: HTMLElement | null,
	replace: boolean = false
) {
	UI.HandleStateFull(component as UIComponent, parent, replace);
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

		const el = document.createElement(tagName);

		if (opts) {
			const keys = Object.keys(opts) as (keyof WritablePart<Node>)[];

			for (const key of keys) {
				if (opts[key] === undefined) continue;

				el[key] = opts[key];

				if (
					el.getAttribute(key) != opts[key] &&
					!key.startsWith("on") &&
					(key as keyof WritablePart<Element>) != "className"
				)
					el.setAttribute(key, opts[key]);
			}
		}

		UI.createChilds(el, children);

		return el;
	}

	public static createFragment(...children: children) {

		const el = document.createDocumentFragment()

		UI.createChilds(el, children)

		return el

	}

	private static createChilds(parent: HTMLElement | DocumentFragment, children: children) {
		if (parent === null) return;
		for (const child of children) {
			if (typeof child === "string")
				parent.appendChild(document.createTextNode(child));

			if (typeof child === "number" || typeof child === "boolean")
				parent.appendChild(document.createTextNode(child.toString()));

			if (child instanceof HTMLElement) parent.appendChild(child);

			if (child instanceof DocumentFragment) parent.appendChild(child)

			// {array.map((el) => {return <div>{el}</div>})
			if (child instanceof Array) this.createChilds(parent, child);
		}
	}

	static setId(el: HTMLElement, id: string) {
		if (el === null) return;
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
		for (let i = 0; i < parent.children.length; i++) {
			const child = parent.children.item(i);

			if (child === null) continue;

			if (
				child.getAttribute("data-fr-id") ===
					actualElement.getAttribute("data-fr-id") &&
				child.tagName === newElement.tagName &&
				child.getAttribute("data-uid") === newElement.getAttribute("data-uid") &&
				child.getAttribute("key") === newElement.getAttribute("key")
			) {
				for (let j = 0; j < newElement.attributes.length; j++) {
					const newChildAttribute = newElement.attributes.item(j);

					if (newChildAttribute === null) continue;

					// Element has not signal
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

	public static HandleStateFull(
		elementFun: UIComponent,
		parent?: HTMLElement | null,
		replace: boolean = false
	) {
		const component = new UIComponentClass(elementFun);
		const id = component.__id__;

		let actualElement = component.render();

		if (!parent) parent = document.body;

		if (replace) parent.replaceChildren(actualElement);
		else parent.appendChild(actualElement);

		component.__state__.addListener("el", (newElement: HTMLElement) => {
			if (this.getId(newElement) !== id) return;

			if (!(newElement instanceof DocumentFragment)) {
				this.smartRerender(parent, actualElement, newElement);
			}

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
