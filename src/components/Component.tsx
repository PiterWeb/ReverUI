import { UIComponent, UIComponentClass, UIElementArgs } from "../UI";

export const $Component = <
	T extends UIComponent<P>,
	P extends UIElementArgs = Parameters<T>[0],
	R = P
>({
	element,
	ref,
	props,
}: R extends undefined | never // Si los props son `undefined` o `never`, no requerimos props
	? {
			element: T;
			props?: never; // No se debe pasar `props`
			ref: UIComponentClass;
	  }
	: {
			element: T;
			props: P; // `props` es requerido si `element` tiene parámetros
			ref: UIComponentClass;
	  }) => {
	return element.bind(ref)(props ?? ({} as P));
};
