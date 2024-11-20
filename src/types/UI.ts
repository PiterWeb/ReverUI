import UIClass from "../UI";
import { $Show, $Component, $For } from "../components";

type $ShowType = typeof $Show;
type $ComponentType = typeof $Component;
type $ForType = typeof $For;

declare global {
	class UI {
		static createElement(): typeof UIClass.createElement;
		static createFragment(): typeof UIClass.createFragment;
	}

	const $Show: $ShowType;
	const $Component: $ComponentType;
	const $For: $ForType;
}
