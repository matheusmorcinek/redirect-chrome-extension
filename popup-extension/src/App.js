import React from 'react';
import './App.css';
import { hello, saveRule } from './main';
import Button from './components/styled-mui-components/Button';
import Rules from './components/Rules/Rules';
import { ExtensionContextProvider } from './context/extensionContext.jsx'

const App = () => {

  return (
    <>
      <div id="extension-app" className="app-popup-header">
        <h1>💻 Redirect Network Request Chrome Extension</h1>
      </div>
      <ExtensionContextProvider>
        <div className="app-popup-container">

          <Rules />

          <Button variant="contained" onClick={() => hello()}>Hello</Button>
          <Button variant="contained" onClick={() => saveRule()}>Save Rule</Button>
        </div >
      </ExtensionContextProvider>
    </>
  );
}

export default App;
