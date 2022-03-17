import React from 'react';
import './App.css';
import { hello, saveRule } from './main';
import Button from './components/styled-mui-components/CustomButton/Button';
import Rules from './components/Rules/Rules';
import { ExtensionContextProvider } from './context/extensionContext.jsx'

const App = () => {

  return (
    <ExtensionContextProvider>
      <div id="extension-app" className="app-popup-container">

        <Rules />

        <Button variant="contained" onClick={() => hello()}>Hello</Button>
        <Button variant="contained" onClick={() => saveRule()}>Save Rule</Button>
      </div >
    </ExtensionContextProvider>
  );
}

export default App;
