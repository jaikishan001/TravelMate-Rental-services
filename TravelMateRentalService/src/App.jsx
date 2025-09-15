import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}


export default App;
