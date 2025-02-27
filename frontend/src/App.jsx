import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import About from "./components/About";
import SellerHome from "./Seller/SellerHome";
import BuyerHome from "./buyer/BuyerHome";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import MyBook from "./Seller/MyBook";
import Profile from "./components/Profile";
import ForgetPassword from "./components/ForgetPassword";
import AddBook from "./Seller/AddBook";
import "bootstrap/dist/css/bootstrap.min.css";
import BookDetails from "./components/BookDetails";
import Cart from "./components/Cart";
import Confirmation from "./components/Confirmation";

const ProtectedRoute = ({ user, role, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return user.role === role ? children : <Navigate to="/" replace />;
};

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/about" element={<About />} />
        {/* Buyer Routes - Protected */}
        <Route
          path="/buyer"
          element={
            <ProtectedRoute user={user} role="buyer">
              <BuyerHome user={user} />
            </ProtectedRoute>
          }
        >
          <Route path="profile/:id" element={<Profile user={user} />} />
          <Route path="mybooks" element={<MyBook user={user} />} />
          <Route path="cart" element={<Cart user={user} />} />
        </Route>
        <Route path="/confirmation" element={<Confirmation />} />
        {/* Seller Routes */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute user={user} role="seller">
              <SellerHome user={user} />
            </ProtectedRoute>
          }
        >
          <Route path="profile/:id" element={<Profile user={user} />} />
          <Route path="mybook" element={<MyBook user={user} />} />
          <Route path="add-book/:id" element={<AddBook user={user} />} />
        </Route>
        <Route path="/book/:id" element={<BookDetails user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}
ProtectedRoute.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string.isRequired,
  }),
  role: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  setUser: PropTypes.func.isRequired, // Fixes ESLint warning
};
