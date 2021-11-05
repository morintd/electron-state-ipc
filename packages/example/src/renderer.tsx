import React from 'react';
import ReactDOM from 'react-dom';
import { ElectronStateIPCContextProvider } from 'electron-state-ipc/react';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './components/App';

ReactDOM.render(
  <ElectronStateIPCContextProvider>
    <App />
  </ElectronStateIPCContextProvider>,
  document.getElementById('root'),
);
