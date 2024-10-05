# ReverUI

![](https://badgen.net/bundlephobia/minzip/reverui)

<img src="https://github.com/user-attachments/assets/88fd50a3-bb27-47c5-bdc7-618531ffc75c" alt="reverui-preview" width="500px" height="500px"/>

Effortless UI, Powerful Simplicity
- 🔥 Similar to React
- 🔑 TS Native 🔐 (But can be used with JS)
- ❌ No Virtual DOM 📦
- ❌ No compiler ⚙
- 📦 [Rever Router](https://github.com/PiterWeb/ReverRouter) (Router for ReverUI)

### Try out [now](https://stackblitz.com/github/PiterWeb/ViteReverUITemplate)

### Current functionality:

-   [x] React-like JSX
-   [x] Good intellisense
-   [x] useSignal ♻
-   [x] useEffect (state changes & mounted)
-   [x] Fragments (<> </>)
-   [x] Custom Hooks (must start with "$use")
-   [x] Conditional Rendering (ternary operator or <$Show when={condition}/>) ❓
-   [x] Loop Rendering (array.map) 📜
-   [x] Event Handling (all events in lowercase) <kbd>Click</kbd> <kbd>Key</kbd> ...
-   [x] Compatible with Vite Plugins (TailwindCSS, ...) ✨
-   [x] Reusable Components (<$Component/>) 📦
-   [x] Smart Re-rendering 🧠

**The project is built on top of Vite**

This are the features that Vite provides:

-   JSX Parser (Configurable)
-   Typescript config
-   Bundler
-   HMR (Hot Module Replacement)
-   Support for CSS Preprocessors
-   Transpiler

### Try it yourself:

There is a prepared [Vite template](https://github.com/PiterWeb/ViteReverUITemplate) ready to use that includes examples & TailwindCSS configured by default

#### Steps:

-   Clone the repository: `git clone https://github.com/PiterWeb/ViteReverUITemplate.git`
-   Open the folder & install the dependencies: `npm install`
-   Run the development enviroment: `npm run dev`

#### More Examples:

-   $useSignal:

    ```tsx
    import { $useSignal } from "reverui";

    export default function StateFullApp() {
    	const mySignal = $useSignal("initValue");

    	return <div>...</div>;
    }
    ```

-   $useEffect:

    ```tsx
    import { $useEffect, $useSignal } from "reverui";

    export default function StateFullApp() {
    	$useEffect(() => {
    		console.log("Mounted");
    	});

    	const counter = $useSignal(0);

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
    	// UseEffect with no dependencies before $useSignal will be called only on mount
    	$useEffect(() => {
    		console.log("Mounted");
    	});

    	const counter = $useSignal(0);
    	// const signal = $useSignal(initialValue);

    	// $useEffect with dependencies will be called only when the dependencies change
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
