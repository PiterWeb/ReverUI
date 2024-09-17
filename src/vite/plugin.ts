import type { PluginOption } from "vite";
import {
	getJSXElementName,
	replaceSpecialFunctions,
	replaceImport,
	replaceSignalHTMLElement,
	replaceCustomHooks,
} from "./transform";
import configHandler from "./config";

export default {
	name: "ui-proccessor",
	transform(code: string, id: string) {
		if (!id.includes("/src")) return;

		if (id.endsWith("ts") || id.endsWith("js")) {
			let newCode =  replaceCustomHooks(code);
			newCode = replaceImport(newCode);
			// console.log(newCode);
			return {
				code: newCode,
				map: null,
			};
		}

		if (!id.endsWith("tsx") && !id.endsWith("jsx")) return;

		const name = getJSXElementName(code);
		let newCode = replaceSpecialFunctions(code, name);
		newCode = replaceImport(newCode);
		// console.log(newCode);
		newCode = replaceSignalHTMLElement(newCode);

		return {
			code: newCode,
			map: null,
		};
	},
	version: "0.1.0",
	config: {
		handler: configHandler,
	},
} as PluginOption;
