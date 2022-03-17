import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ExtensionContextProvider } from './context/extensionContext.jsx'

ReactDOM.render(
  <React.StrictMode>
    <ExtensionContextProvider>
      <App />
    </ExtensionContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
