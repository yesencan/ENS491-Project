import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useState } from 'react';
import Navbar from "./components/Launch/Navbar";
import Launch from "./pages/Launch";
import Output from "./pages/Output";
import Input from "./pages/Input";
import OutputDataContext from './contexts/OutputDataContext';

const App = () => {
  const [outputData, setOutputData] = React.useState(null);
  return (
    <OutputDataContext.Provider value={{ outputData, setOutputData }}>
      <BrowserRouter>
        <Navbar />
          <Routes>
            <Route path="/" element={<Launch />}></Route>
            <Route path="/results" element={<Output />}></Route>
            <Route path="/input" element={<Input />}></Route>
          </Routes>
      </BrowserRouter>
    </OutputDataContext.Provider>
  );
};

export default App;
