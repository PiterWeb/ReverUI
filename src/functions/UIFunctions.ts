export interface Signal<t> {
	value: t;
}

export function $useSignal<T>(_initvalue: T) {
	return {} as Signal<T>;
}
export function $useEffect(
	_callback: () => void,
	_dependencies: Signal<unknown>[]
) {}
