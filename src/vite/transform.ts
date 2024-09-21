import { UIGenerateId } from "../utils/id";

// export function replaceImport(code: string) {
// 	const regex = /import\s*([^+]*)\s*from\s*"@UIFunctions"/g;

// 	return code.replace(regex, `import $1 from "@UIFunctions_internal"`);
// }

export function replaceSignalHTMLElement(code: string) {
	// const regex = /UI.createElement\s*\(\s*("[^]")\s*,\s*{([^]*)}\s*,\s*(\w+).value\)/g;
	// Replace the createElement with the new one (if has parameters)
	const regex =
		/UI.createElement\s*\(\s*?("[^*]*")\s*,\s*{([^*]*)\s*},\s*(\w+).value\s*/g;

	let newCode = code.replaceAll(
		regex,
		`UI.createElement($1, {$2, ["data-rui-"+$3.id]: $3.lastValueStringified, "uid": "${UIGenerateId()}"}, $3.value`
	);

	// Replace the createElement with the new one (if has no parameters)
	// regex =
	//     /UI.createElement\s*\(\s*?(".*?")\s*,\s*null,\s*(.*?)\s*(\w+).value\s*,?\s*(.*?)?\s*\)/g;

	// const match = newCode.match(regex);

	// if (!match) return newCode;

	// console.log(match);

	// match.forEach((createElement) => {
	//     const newElement = createElement.replaceAll(
	//         regex,
	//         `UI.createElement($1, {["data-rui-"+$3.id]: $3.lastValue(), "uid": "${generateId()}"}, $2)`
	//     );

	//     newCode = newCode.replace(createElement, newElement);
	// })

	return newCode;
}

export function replaceCustomHooks(code: string) {
	let newCode = code;

	const parentArg = "__parent__arg__";

	newCode = replaceSpecialFunctions(newCode, parentArg);

	return newCode;
}

export function replaceSpecialFunctions(code: string, name: string) {
	let newCode = code;

	const id = UIGenerateId();

	newCode = newCode.replaceAll(
		"$useSignal",
		"$useSignal__internal"
	)

	newCode = newCode.replaceAll(
		"$useEffect",
		"$useEffect__internal"
	)

	// useSignal
	// Add id to useSignal
	newCode = newCode.replaceAll(
		/(\w+)\s*=\s*\$useSignal__internal\s*\(([^)]*)\)\s*/g,
		`$1 = \$useSignal__internal($2, "$1-${id}");`
	);

	// Add parent name to all use<Name>() functions [customHooks, useSignal, useEffect]
	newCode = newCode.replaceAll(
		/\s*\$use(\w+)\s*\(\s*/g,
		` \$use$1(${name}, `
	);

	return newCode;
}

// export function getJSXElementName(code: string) {
// 	const match = code.match(/export\s+default\s+function\s+(\w+)\(.*\)/i);
// 	if (!match) return "";
// 	return match[1];
// }
