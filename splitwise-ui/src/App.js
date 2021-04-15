import React, { Component } from "react";
import "./App.css";
import Main from "./Main";
import { BrowserRouter } from "react-router-dom";
import { HashRouter } from "react-router-dom/cjs/react-router-dom.min";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Main />
      </div>
    </BrowserRouter>
  );
}

export default App;
