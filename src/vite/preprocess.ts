import { IDGenerator } from "../utils/id";

const INTERNAL_IDGenerator = new IDGenerator();

export function replaceSignalHTMLElement(code: string) {
	const regex =
		/UI.createElement\s*\(\s*?("[^*]*")\s*,\s*{([^*]*)\s*},\s*(\w+).value\s*/g;

	const uid = INTERNAL_IDGenerator.generate();

	let newCode = code.replaceAll(
		regex,
		(_, tagName: string, options: string, signal: string) => {
			return `UI.createElement(${tagName}, {${options}, ["data-rui-"+${signal}.id]: ${signal}.lastValueStringified, "data-uid": "${uid}"}, ${signal}.value`;
		}
	);

	return newCode;
}

export function replaceComponentsRef(code: string) {
	const regex = /(\$Component,\s*{)(\s*)/g;

	let newCode = code.replaceAll(
		regex,
		(_, $Component: string, args: string) => {
			return `${$Component}\n  ref: this,${args}`;
		}
	);

	newCode = replaceForComponentRef(newCode);
	newCode = replaceShowComponentRef(newCode);

	return newCode;
}

function replaceShowComponentRef(code: string) {
	const regex = /(\$Show,\s*{)(\s*)/g;

	let newCode = code.replaceAll(regex, (_, $Show: string, args: string) => {
		return `${$Show}\n  ref: this,${args}`;
	});

	return newCode;
}

function replaceForComponentRef(code: string) {
	const regex = /(\$For,\s*{)(\s*)/g;

	let newCode = code.replaceAll(regex, (_, $For: string, args: string) => {
		return `${$For}\n  ref: this,${args}`;
	});

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

	newCode = replaceSignals(newCode);
	newCode = replaceEffects(newCode);

	// Add parent name to all use<Name>() functions [customHooks, useSignal, useEffect]
	newCode = newCode.replaceAll(
		/\s*\$use(\w+)\s*\(\s*/g,
		` \$use$1(${name}, `
	);

	return newCode;
}

function replaceSignals(code: string) {
	let newCode = code.replaceAll("$useSignal", "$useSignal__internal");
	newCode = newCode.replaceAll("$useDerived", "$useDerived__internal")

	// useSignal
	// Add id to useSignal
	const $useSignalSearchRegex =
		/(\w+)\s*=\s*\$useSignal__internal\s*\(([^)]*)\)\s*/g;


	newCode = newCode.replaceAll(
		$useSignalSearchRegex,
		(_, name, initiValue) => {
			const id = INTERNAL_IDGenerator.generate();
			return `${name} = \$useSignal__internal(${initiValue}, "${name}-${id}");`;
		}
	);

	const $useDerivedSearchRegex =
	/(\w+)\s*=\s*\$useDerived__internal\s*\(([^)]*)\)([^)]*)\)\s*/g;

	newCode = newCode.replaceAll(
		$useDerivedSearchRegex,
		(_, name, initiValue, cllbckBody) => {
			const id = INTERNAL_IDGenerator.generate();
			return `${name} = \$useDerived__internal(${initiValue})${cllbckBody}, "${name}-${id}");`;
		}
	);

	return newCode;
}

function replaceEffects(code: string) {
	let newCode = code.replaceAll("$useEffect", "$useEffect__internal");

	// useEffect
	// Add id to useEffect
	const $useEffectSearchRegex =
		/\$useEffect__internal\s*\((\s*\(\s*[^]*?\s*\)\s*[^]*?\s*\])\s*\)\s*/g;

	newCode = newCode.replaceAll($useEffectSearchRegex, (_, content) => {
		// Uses a new UIGeneratedId for every effect
		const id = INTERNAL_IDGenerator.generate();
		return `$useEffect__internal(${content}, "${id}")`;
	});

	return newCode;
}
