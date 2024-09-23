import { UIGenerateId } from "../utils/id";

export function replaceSignalHTMLElement(code: string) {

	const regex =
		/UI.createElement\s*\(\s*?("[^*]*")\s*,\s*{([^*]*)\s*},\s*(\w+).value\s*/g;

	let newCode = code.replaceAll(
		regex,
		`UI.createElement($1, {$2, ["data-rui-"+$3.id]: $3.lastValueStringified, "uid": "${UIGenerateId()}"}, $3.value`
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

	const id = UIGenerateId();

	newCode = newCode.replaceAll("$useSignal", "$useSignal__internal");
	newCode = newCode.replaceAll("$useEffect", "$useEffect__internal");

	// useSignal
	// Add id to useSignal
	newCode = newCode.replaceAll(
		/(\w+)\s*=\s*\$useSignal__internal\s*\(([^)]*)\)\s*/g,
		`$1 = \$useSignal__internal($2, "$1-${id}");`
	);

	// useEffect
	// Add id to useEffect
	const $useEffectSearchRegex =
		/\$useEffect__internal\s*\((\s*\(\s*[^]*?\s*\)\s*[^]*?\s*\])\s*\)\s*/g;

	newCode = newCode.replaceAll($useEffectSearchRegex, (_, match) => {
		// Uses a new UIGeneratedId for every effect
		return `$useEffect__internal(${match}, "${UIGenerateId()}")`;
	});

	// Add parent name to all use<Name>() functions [customHooks, useSignal, useEffect]
	newCode = newCode.replaceAll(
		/\s*\$use(\w+)\s*\(\s*/g,
		` \$use$1(${name}, `
	);

	return newCode;
}
