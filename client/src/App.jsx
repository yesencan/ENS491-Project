import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Launch/Navbar";
import Launch from "./pages/Launch";
import Output from "./pages/Output";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Launch />}></Route>
          <Route path="/results" element={<Output />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
