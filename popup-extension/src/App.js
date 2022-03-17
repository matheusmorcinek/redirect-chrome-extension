import React from 'react';
import './App.css';
import { hello, saveRule } from './main';
import Button from './components/styled-mui-components/CustomButton/Button';
import Rules from './components/Rules/Rules';

const App = () => {

  return (
    <>
      <div className="app-popup-container">
        <Rules />
        <Button variant="contained" onClick={() => hello()}>Hello</Button>
        <Button variant="contained" onClick={() => saveRule()}>Save Rule</Button>
      </div >
      <div id="extension-app" />
    </>
  );
}

export default App;
