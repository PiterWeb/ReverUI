export interface Signal<t> {
	value: t;
}

export function $useDerived<T, P>(_initSignal: Signal<T>, _cllbk: (_value: T) => P) {
	return {} as Signal<P>
}

export function $useSignal<T>(_initvalue: T) {
	return {} as Signal<T>;
}
export function $useEffect(
	_callback: () => void,
	_dependencies: Signal<unknown>[]
) {}

export function $useGlobalSignal<T>(_key: string ,_initvalue: T) {
	return {} as Signal<T>;
}