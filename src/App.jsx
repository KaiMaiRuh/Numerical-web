import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Bisection from "./pages/Bisection";
import FalsePosition from "./pages/FalsePosition";
import OnePoint from "./pages/OnePoint";
import NewtonRaphson from "./pages/NewtonRaphson";
import Secant from "./pages/Secant";

function App() {
  return (
    <BrowserRouter basename="/Numerical-web">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bisection" element={<Bisection />} />
        <Route path="/falsepo" element={<FalsePosition />} />
        <Route path="/onepoint" element={<OnePoint />} />
        <Route path="/newtonrap" element={<NewtonRaphson />} />
        <Route path="/secant" element={<Secant />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
