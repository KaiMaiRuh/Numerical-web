// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Bisection from "./pages/Bisection";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bisection" element={<Bisection />} />
        {/* เพิ่มหน้าอื่นๆได้ */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
