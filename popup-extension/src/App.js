import React from 'react';
import './App.css';
import Button from './components/styled-mui-components/CustomButton/Button';
import Rules from './components/Rules/Rules';

const App = () => {

  return (
    <>
      <div className="app-popup-container">
        <Rules />
      </div >
      <div id="extension-app" />
    </>
  );
}

export default App;
