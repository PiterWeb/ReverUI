import { ConfigEnv, UserConfig } from "vite";

type handlerReturn =
	| UserConfig
	| null
	| void
	| Promise<UserConfig | null | void>;

export default function configHandler(
	config: UserConfig,
	_env: ConfigEnv
): handlerReturn {
	config.esbuild = {
		...config.esbuild,
		jsxInject: `import {UI} from "reverui";\n`,
		jsxFactory: "UI.createElement",
		jsxFragment: "UI.Fragment",
		jsxImportSource: "reverui",
	};
}
