# electron-state-ipc

[![npm](https://img.shields.io/npm/v/electron-state-ipc)](https://www.npmjs.com/package/electron-state-ipc)
[![Build](https://circleci.com/gh/morintd/electron-state-ipc.svg?style=shield)](https://app.circleci.com/pipelines/github/morintd/electron-state-ipc)
[![npm](https://img.shields.io/npm/dm/electron-state-ipc)](https://www.npmjs.com/package/electron-state-ipc)

Easily synchronize state between main process and renderer in Electron, using your favorite UI framework:

- React
- Vue (coming soon)
- Angular (coming soon)

![Example in practice](https://github.com/morintd/electron-state-ipc/blob/master/example.gif?raw=true)

## Installation

**yarn**

```sh
$ yarn add electron-state-ipc
```

**npm**

```sh
$ npm add electron-state-ipc --save
```

## Usage

After [configuration](#configuration), you will be able to use `electron-state-ipc` with:

### React

You can access the following hooks. They all imitate default React hook, but includes an additional key. It's used to track the specific state you're trying to access (`'foo'` in the following examples):

#### useStateIPC

This is an equivalent to `useState`.

```tsx
import { useStateIPC } from 'electron-state-ipc/react';

function Example() {
  const [foo, setFoo] = useStateIPC<string>('foo', '');

  return (
    <div>
      <p>Foo: {foo}</p>
      <input value={foo} onChange={(e) => setFoo(e.target.value)} />
    </div>
  );
}
```

#### useReducerIPC

_Coming soon ..._

### Vue

_Coming soon ..._

### Angular

_Coming soon ..._

## Configuration

In order for `electron-state-ipc` to work, it must be set up inside the _main process_, _preload script_ and in your render, depending on which UI framework your use.

### Main process

There is two elements here, we need to:

- Receive updates from all `BrowserWindow`, update the main state, and communicate it to other `BrowserWindow`.
- Send the state to the new `BrowserWindow` when creating it.

In practice, you just need to setup the global state:

```ts
import { setupGlobalStateIPC } from 'electron-state-ipc';
import { BrowserWindow } from 'electron';

setupGlobalStateIPC();

/* you might set up anything else and create your BrowserWindow(s) */
...

const window = new BrowserWindow({
  ...options, // your options
});
```

Note that `setupGlobalStateIPC` return the state itself, if you need to use in in the main process:

In practice, you just need to setup the global state:

```ts
import { setupGlobalStateIPC } from 'electron-state-ipc';

const state = setupGlobalStateIPC();
```

### Preload

For security reasons, this library is built with [context isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation) in mind.

A single function is needed to set up `electron-state-ipc` inside your **preload** script:

```ts
import { exposeStateIPC } from 'electron-state-ipc';

exposeStateIPC();
```

You might expose your own APIs, so your preload script might look somewhat like:

```ts
import { contextBridge } = from 'electron';
import { exposeStateIPC } from 'electron-state-ipc';

contextBridge.exposeInMainWorld('myAPI', {
  doAThing: () => {},
});

exposeStateIPC();
```

### Renderer

#### React

As `electron-state-ipc` works with a context provider. It must be set up, as well as initialized before using any [hook](#usage).

To be safe, I would render it as a top-level component and wait for it to be initialized, rendering nothing or a loader in the meantime:

```tsx
import { ElectronStateIPCContextProvider } from 'electron-state-ipc/react';

ReactDOM.render(
  <ElectronStateIPCContextProvider>
    <App />
  </ElectronStateIPCContextProvider>,
  document.getElementById('root'),
);
```

And in the App component:

```tsx
import { useElectronStateIPC } from 'electron-state-ipc/react';

function AppProvider() {
  const state = useElectronStateIPC();
  if (!state.initialized) return null;

  return (
    ... // your app: other providers, components, routes ...
  );
}
```

#### Vue

_Coming soon ..._

#### Angular

_Coming soon ..._
