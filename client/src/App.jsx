import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from 'react';
import Navbar from "./components/Launch/Navbar";
import Footer from "./components/Launch/Footer";
import Output from "./pages/Output";
import Input from "./pages/Input";
import OutputDataContext from './contexts/OutputDataContext';
import AboutPage from "./pages/About";
import TutorialPage from "./pages/Tutorial";

const App = () => {
  const [outputData, setOutputData] = React.useState(null);
  return (
    <OutputDataContext.Provider value={{ outputData, setOutputData }}>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Input />} />
              <Route path="/results" element={<Output />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/tutorial" element={<TutorialPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </OutputDataContext.Provider>
  );
};

export default App;
