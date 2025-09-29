import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Bisection from "./pages/Bisection";

function App() {
  return (
    <BrowserRouter basename="/Numerical-web">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bisection" element={<Bisection />} />
        {/* เพิ่มหน้าอื่นๆ ได้ */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
