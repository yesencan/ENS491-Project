import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from 'react';
import Navbar from "./components/Launch/Navbar";
import Output from "./pages/Output";
import Input from "./pages/Input";
import OutputDataContext from './contexts/OutputDataContext';
import Intro from "./components/Launch/Intro";

const App = () => {
  const [outputData, setOutputData] = React.useState(null);
  return (
    <OutputDataContext.Provider value={{ outputData, setOutputData }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Input />}></Route>
          <Route path="/results" element={<Output />}></Route>
          <Route path="/about" element={<Intro />}></Route>
        </Routes>
      </BrowserRouter>
    </OutputDataContext.Provider>
  );
};

export default App;
