
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
// Root of Equation
import Bisection from "./pages/Bisection";
import FalsePosition from "./pages/FalsePosition";
import OnePoint from "./pages/OnePoint";
import Taylor from "./pages/Taylor";
import NewtonRaphson from "./pages/NewtonRaphson";
import Secant from "./pages/Secant";
// Linear System
import Cramer from "./pages/Cramer";
import Gaussian from "./pages/Gaussian";
import GaussJordan from "./pages/GaussJordan";
import MatrixInversion from "./pages/MatrixInversion";
import LUDecomposition from "./pages/LUDecomposition";
import Cholesky from "./pages/Cholesky";
import Jacobi from "./pages/Jacobi";
import GaussSeidel from "./pages/GaussSeidel";
import ConjugateGradient from "./pages/ConjugateGradient";
// Interpolation
import LagrangeInterp from "./pages/LagrangeInterp";
import LinearInterp from "./pages/LinearInterp";
import QuadraticInterp from "./pages/QuadraticInterp";
import PolynomialInterp from "./pages/PolynomialInterp";
import LinearSpline from "./pages/LinearSpline";
import QuadraticSpline from "./pages/QuadraticSpline";
import CubicSpline from "./pages/CubicSpline";
// Regression
import SingleLinear from "./pages/SingleLinear";
import MultipleLinear from "./pages/MultipleLinear";
import PolynomialReg from "./pages/PolynomialReg";
import NonlinearReg from "./pages/NonlinearReg";
// Integration
import SingleTrapezoidal from "./pages/SingleTrapezoidal";
import CompositeTrapezoidal from "./pages/CompositeTrapezoidal";
import SimpsonsRule from "./pages/SimpsonsRule";
import CompositeSimpson from "./pages/CompositeSimpson";
// Differentiation
import FirstDivided from "./pages/FirstDivided";
import SecondDivided from "./pages/SecondDivided";
import ForwardDivided from "./pages/ForwardDivided";
import BackwardDivided from "./pages/BackwardDivided";
import CentralDivided from "./pages/CentralDivided";

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
        {/* Linear System */}
        <Route path="/cramer" element={<Cramer />} />
        <Route path="/gaussian" element={<Gaussian />} />
        <Route path="/gaussjordan" element={<GaussJordan />} />
        <Route path="/matrixinversion" element={<MatrixInversion />} />
        <Route path="/ludecomposition" element={<LUDecomposition />} />
        <Route path="/cholesky" element={<Cholesky />} />
        <Route path="/jacobi" element={<Jacobi />} />
        <Route path="/gaussseidel" element={<GaussSeidel />} />
        <Route path="/conjugategradient" element={<ConjugateGradient />} />
        {/* Interpolation */}
        <Route path="/lagrangeinterp" element={<LagrangeInterp />} />
        <Route path="/linearinterp" element={<LinearInterp />} />
        <Route path="/quadraticinterp" element={<QuadraticInterp />} />
        <Route path="/polynomialinterp" element={<PolynomialInterp />} />
        <Route path="/linearspline" element={<LinearSpline />} />
        <Route path="/quadraticspline" element={<QuadraticSpline />} />
        <Route path="/cubicspline" element={<CubicSpline />} />
        {/* Regression */}
        <Route path="/singlelinear" element={<SingleLinear />} />
        <Route path="/multiplelinear" element={<MultipleLinear />} />
        <Route path="/polynomialreg" element={<PolynomialReg />} />
        <Route path="/nonlinearreg" element={<NonlinearReg />} />
        {/* Integration */}
        <Route path="/singletrapezoidal" element={<SingleTrapezoidal />} />
        <Route path="/compositetrapezoidal" element={<CompositeTrapezoidal />} />
        <Route path="/simpsonsrule" element={<SimpsonsRule />} />
        <Route path="/compositesimpson" element={<CompositeSimpson />} />
        {/* Differentiation */}
        <Route path="/firstdivided" element={<FirstDivided />} />
        <Route path="/seconddivided" element={<SecondDivided />} />
        <Route path="/forwarddivided" element={<ForwardDivided />} />
        <Route path="/backwarddivided" element={<BackwardDivided />} />
        <Route path="/centraldivided" element={<CentralDivided />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
