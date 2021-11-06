/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { useElectronStateIPC } from 'electron-state-ipc/react';

import Form from './Form';
function App() {
  const state = useElectronStateIPC();
  if (!state.initialized) return <p>Loading...</p>;

  return (
    <div>
      <Form />
      <button
        type="button"
        className="btn btn-primary"
        style={{ position: 'absolute', bottom: 10, right: 10 }}
        id="new-window"
        onClick={() => {
          // @ts-expect-error need to add electron to global type
          window.electron.openNewWindow();
        }}
      >
        New window
      </button>
    </div>
  );
}

export default App;
