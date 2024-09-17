# ReverUI (A try to implement a similar but more enjoyable React library without VDOM)

## Experimental ⚠️

#### 🔥 Simpler than React 👀
#### 🔑 TS Native 🔐
#### ❌ No Virtual DOM 📦

## Current functionality:

-   [x] React-like JSX
-   [x] useSignal ♻
-   [x] Good intellisense
-   [x] useEffect (state changes & mounted)
-   [x] Fragments (<> </>) (only work without state)
-   [x] Custom Hooks (must start with "use")
-   [x] Conditional Rendering (ternary operator) ❓
-   [x] List Rendering (array.map) 📜
-   [x] Event Handling (all events in lowercase) <kbd>Click</kbd> <kbd>Key</kbd> ...
-   [x] TailwindCSS ✨
-   [x] Reusable Components on JSX (But cannot be stateful) 📦
-   [ ] Same Statefull Component on the same parent
-   [x] Selective(Smart) Re-rendering 🧠

**The project is built on top of Vite**

This are the features that Vite provides:

-   JSX Parser (Configurable)
-   Typescript config
-   Bundler
-   HMR (Hot Module Replacement)
-   Support for CSS Preprocessors
-   Transpiler

## Try it yourself:

### Steps:

-   Clone the repository: `git clone https://github.com/PiterWeb/ReactiveUI.git`
-   Open the folder & install the dependencies: `npm install`
-   Run the development enviroment: `npm run dev`

## Examples:

-   useSignal:

    ```tsx
    import { $useSignal } from "reverui";

    export default function StateFullApp() {
        const mySignal = $useSignal("initValue");

        return <div>...</div>;
    }
    ```

-   useEffect:

    ```tsx
    import { $useEffect } from "reverui";

    export default function StateFullApp() {
        $useEffect(() => {
            console.log("Mounted");
        });

        const counter = useSignal(0);

        $useEffect(() => {
            console.log("Counter value changed to " + counter.value);
        }, [counter]);

        return <div>...</div>;
    }
    ```

-   Example Counter Component:

    ```tsx
    import { $useSignal, $useEffect } from "reverui";

    export default function StateFullApp() {
        // UseEffect with no dependencies before useState will be called only on mount
        $useEffect(() => {
            console.log("Mounted");
        });

        const counter = useSignal(0);
        // const signal = useSignal(initialValue);

        // UseEffect with dependencies will be called only when the dependencies change
        $useEffect(() => {
            console.log("Counter value changed to " + counter.value);
        }, [counter]);

        return (
            <div>
                <h1>Stateful Component</h1>
                <p>
                    {" "}
                    Counter: {counter.value === 0
                        ? "You didn't click"
                        : counter.value}{" "}
                </p>
                <button onclick={() => counter.value++}>Increment</button>
            </div>
        );
    }
    ```