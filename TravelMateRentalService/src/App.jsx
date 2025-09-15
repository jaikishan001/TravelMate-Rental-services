import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import Contact from "./pages/Contact";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}


export default App;
