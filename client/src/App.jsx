import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Launch/Navbar";
import Launch from "./pages/Launch";
import Output from "./pages/Output";
import Input from "./pages/Input";
import styled from "styled-components";


const AppContainer = styled.div`
  padding-top: 70px;
`;

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <AppContainer>
          <Routes>
            <Route path="/" element={<Launch />}></Route>
            <Route path="/results" element={<Output />}></Route>
            <Route path="/input" element={<Input />}></Route>
          </Routes>
        </AppContainer>
      </BrowserRouter>
    </>
  );
};

export default App;
