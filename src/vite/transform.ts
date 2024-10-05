import { IDGenerator } from "../utils/id";

const INTERNAL_IDGenerator = new IDGenerator();

export function replaceSignalHTMLElement(code: string) {
	const regex =
		/UI.createElement\s*\(\s*?("[^*]*")\s*,\s*{([^*]*)\s*},\s*(\w+).value\s*/g;

	const uid = INTERNAL_IDGenerator.generate();

	let newCode = code.replaceAll(
		regex,
		(_, tagName: string, options: string, signal: string) => {
			return `UI.createElement(${tagName}, {${options}, ["data-rui-"+${signal}.id]: ${signal}.lastValueStringified, "data-uid": "${uid}"}, ${signal}.value`
		}
	);

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

	newCode = newCode.replaceAll("$useSignal", "$useSignal__internal");
	newCode = newCode.replaceAll("$useEffect", "$useEffect__internal");

	// useSignal
	// Add id to useSignal
	const $useSignalSearchRegex =
		/(\w+)\s*=\s*\$useSignal__internal\s*\(([^)]*)\)\s*/g;

	newCode = newCode.replaceAll($useSignalSearchRegex, (_, name, initiValue) => {
		const id = INTERNAL_IDGenerator.generate();
		return `${name} = \$useSignal__internal(${initiValue}, "${name}-${id}");`;
	});

	// useEffect
	// Add id to useEffect
	const $useEffectSearchRegex =
		/\$useEffect__internal\s*\((\s*\(\s*[^]*?\s*\)\s*[^]*?\s*\])\s*\)\s*/g;

	newCode = newCode.replaceAll($useEffectSearchRegex, (_, content) => {
		// Uses a new UIGeneratedId for every effect
		const id = INTERNAL_IDGenerator.generate();
		return `$useEffect__internal(${content}, "${id}")`;
	});

	// Add parent name to all use<Name>() functions [customHooks, useSignal, useEffect]
	newCode = newCode.replaceAll(
		/\s*\$use(\w+)\s*\(\s*/g,
		` \$use$1(${name}, `
	);

	return newCode;
}
