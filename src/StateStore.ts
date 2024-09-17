export type Listener<t> = (e: t) => void;

export interface StateMethods {
    addListener<t>(propsString: string, l: Listener<t>): void;
    removeListener<t>(prop: string, l: Listener<t>): void;
    setProp<t>(name: string, value: t): void;
    getProp<t>(name: string): t;
    getProps(): Map<string, any>;
}

export default class StateStore {
    listeners = new Map<string, Set<Listener<any>>>();
    props = new Map<string, any>();

    constructor() {}

    public getProps() {
        return this.props;
    }

    public getProp<t>(name: string): t {
        return this.props.get(name);
    }

    public setProp<t>(name: string, value: t) {
        this.props.set(name, value);
        if (this.listeners.has(name)) {
            this.listeners.get(name)?.forEach((l) => l(value));
        }
    }

    public addListener<t>(propsString: string, l: Listener<t>) {
        const props = propsString.split(",");

        props.forEach((prop) => {
            prop = prop.trim();

            if (this.listeners.has(prop)) {
                const listeners =
                    this.listeners.get(prop) ?? new Set<Listener<t>>();
                this.listeners.set(prop, listeners.add(l));
                return;
            }
            this.listeners.set(prop, new Set<Listener<t>>().add(l));
        });
    }

    public removeListener<t>(prop: string, l: Listener<t>) {
        if (!this.listeners.has(prop)) return;
        if (!this.listeners.get(prop)?.has(l)) return;

        const listeners = this.listeners.get(prop) ?? new Set<Listener<t>>();
        listeners.delete(l);
    }
}
