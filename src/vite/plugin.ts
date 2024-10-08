import type { PluginOption } from "vite";
import {
	replaceSpecialFunctions,
	replaceSignalHTMLElement,
	replaceCustomHooks,
} from "./transform";
import configHandler from "./config";

export interface ReverVitePluginOptions {
	ssr?: boolean
}

export default function reverPlugin(options: Partial<ReverVitePluginOptions> = {}): PluginOption {
	return {
		name: "reverui-proccessor",
		transform(code: string, id: string) {
			if (!id.includes("/src")) return;

			if (id.endsWith("ts") || id.endsWith("js")) {
				let newCode = replaceCustomHooks(code);
				return {
					code: newCode,
					map: null,
				};
			}

			if (!id.endsWith("tsx") && !id.endsWith("jsx")) return;

			let newCode = replaceSpecialFunctions(code, "this");
			newCode = replaceSignalHTMLElement(newCode);

			return {
				code: newCode,
				map: null,
			};
		},
		version: "0.3.0",
		config: {
			handler: configHandler,
		},

	}
}