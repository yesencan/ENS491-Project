import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Launch/Navbar";
import Launch from "./pages/Launch";
import Output from "./pages/Output";
import Input from "./pages/Input";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
          <Routes>
            <Route path="/" element={<Launch />}></Route>
            <Route path="/results" element={<Output />}></Route>
            <Route path="/input" element={<Input />}></Route>
          </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
