export {}; // This file needs to be a module

declare global {
	namespace JSX {
		type Element = HTMLElement;

		// type ComponentElement = () => HTMLElement;

		// interface ElementClass extends HTMLElement {}
		type UIElement<T extends keyof HTMLElementTagNameMap> =
			ElementChildrenAttribute &
				Partial<Omit<HTMLElementTagNameMap[T], "children">> & {
					[key: string]: any;
				};
		interface ElementChildrenAttribute {
			children?:
				| JSX.IntrinsicElements[keyof JSX.IntrinsicElements]
				| string
				| number;
		}
		type IntrinsicElements = {
			[elemName in keyof HTMLElementTagNameMap]: UIElement<
				keyof HTMLElementTagNameMap
			>;
		} & {
			svg: SVGElement & ElementChildrenAttribute & Partial<Omit<HTMLElement, "children">>;
			[key: string]: any
		};
	}
}

