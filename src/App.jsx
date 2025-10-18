
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
// Root of Equation
import Bisection from "./pages/Bisection";
import FalsePosition from "./pages/FalsePosition";
import OnePoint from "./pages/OnePoint";
import Taylor from "./pages/Taylor";
import NewtonRaphson from "./pages/NewtonRaphson";
import Secant from "./pages/Secant";
// Linear Algebra
import Cramer from "./pages/Cramer";
import Gaussian from "./pages/Gaussian";
import GaussJordan from "./pages/GaussJordan";
import MatrixInversion from "./pages/MatrixInversion";
import LUDecomposition from "./pages/LUDecomposition";
import Jacobi from "./pages/Jacobi";
import ConjugateGradient from "./pages/ConjugateGradient";
// Interpolation
import LagrangeInterp from "./pages/LagrangeInterp";
import PolynomialInterp from "./pages/PolynomialInterp";
import CubicSpline from "./pages/CubicSpline";
import LinearSpline from "./pages/LinearSpline";
import QuadraticSpline from "./pages/QuadraticSpline";
// Extrapolation / Regression
import SingleLinear from "./pages/SingleLinear";
import MultipleLinear from "./pages/MultipleLinear";
// Integration
import SingleTrapezoidal from "./pages/SingleTrapezoidal";
import CompositeTrapezoidal from "./pages/CompositeTrapezoidal";
import SimpsonsRule from "./pages/SimpsonsRule";
import CompositeSimpson from "./pages/CompositeSimpson";
// Differentiation
import FirstDivided from "./pages/FirstDivided";

function App() {
  return (
    <BrowserRouter basename="/Numerical-web">
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Root of Equation */}
        <Route path="/bisection" element={<Bisection />} />
        <Route path="/falseposition" element={<FalsePosition />} />
  <Route path="/onepoint" element={<OnePoint />} />
  <Route path="/taylor" element={<Taylor />} />
        <Route path="/newtonraphson" element={<NewtonRaphson />} />
        <Route path="/secant" element={<Secant />} />
  {/* Linear Algebra */}
  <Route path="/cramer" element={<Cramer />} />
  <Route path="/gaussian" element={<Gaussian />} />
  <Route path="/gaussjordan" element={<GaussJordan />} />
  <Route path="/matrixinversion" element={<MatrixInversion />} />
  <Route path="/ludecomposition" element={<LUDecomposition />} />
  <Route path="/jacobi" element={<Jacobi />} />
  <Route path="/conjugategradient" element={<ConjugateGradient />} />
  {/* Interpolation */}
  <Route path="/polynomialinterp" element={<PolynomialInterp />} />
  <Route path="/lagrangeinterp" element={<LagrangeInterp />} />
  <Route path="/cubicspline" element={<CubicSpline />} />
  <Route path="/linearspline" element={<LinearSpline />} />
  <Route path="/quadraticspline" element={<QuadraticSpline />} />
  {/* Extrapolation / Regression */}
  <Route path="/singlelinear" element={<SingleLinear />} />
  <Route path="/multiplelinear" element={<MultipleLinear />} />
  {/* Integration */}
  <Route path="/singletrapezoidal" element={<SingleTrapezoidal />} />
  <Route path="/compositetrapezoidal" element={<CompositeTrapezoidal />} />
  <Route path="/simpsonsrule" element={<SimpsonsRule />} />
  <Route path="/compositesimpson" element={<CompositeSimpson />} />
  {/* Differentiation */}
  <Route path="/firstdivided" element={<FirstDivided />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
