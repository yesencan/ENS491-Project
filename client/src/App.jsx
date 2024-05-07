import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from 'react';
import Navbar from "./components/Launch/Navbar";
import Footer from "./components/Launch/Footer";
import Output from "./pages/Output";
import Input from "./pages/Input";
import OutputDataContext from './contexts/OutputDataContext';
import Intro from "./components/Launch/Intro";
import AboutPage from "./pages/About";
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
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </OutputDataContext.Provider>
  );
};

export default App;
