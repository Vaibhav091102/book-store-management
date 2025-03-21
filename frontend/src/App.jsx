import "bootstrap/dist/css/bootstrap.min.css";
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
import BookDetails from "./components/BookDetails";
import Cart from "./components/Cart";
import Confirmation from "./components/Confirmation";
import SearchPage from "./components/SearchPage";
import EditBook from "./components/EditBook";
import AuthorDetails from "./components/AuthorDetails";

const ProtectedRoute = ({ user, role, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return user.role === role ? children : <Navigate to="/" replace />;
};

export default function App() {
  const [user, setUser] = useState(null);
  const [seller, setSeller] = useState(null);
  const [bookId, setBookId] = useState(null);
  const [reload, setReload] = useState(false); // State trigger for re-fetching
  const [cartLength, setCartLength] = useState(0);

  // Function to trigger re-fetch
  const refreshBooks = () => {
    setReload((prev) => !prev); // Toggles `reload` to re-trigger `useEffect`
  };

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
        <Route
          path="/login"
          element={
            <Login
              setUser={setUser}
              setSeller={setSeller}
              setCartLength={setCartLength}
            />
          }
        />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/about" element={<About />} />
        {/* Buyer Routes - Protected */}
        <Route
          path="/buyer"
          element={
            <ProtectedRoute user={user} role="buyer">
              <BuyerHome user={user} cartLength={cartLength} />
            </ProtectedRoute>
          }
        >
          <Route path="profile/:id" element={<Profile user={user} />} />
          <Route path="mybooks" element={<MyBook user={user} />} />
          <Route
            path="cart"
            element={<Cart user={user} setCartLength={setCartLength} />}
          />
        </Route>
        <Route path="/confirmation" element={<Confirmation />} />
        {/* Seller Routes */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute user={user} role="seller">
              <SellerHome user={user} reload={reload} />
            </ProtectedRoute>
          }
        >
          <Route path="profile/:id" element={<Profile user={user} />} />
          <Route
            path="mybook"
            element={<MyBook user={user} setBookId={setBookId} />}
          />
          <Route
            path="add-book/:id"
            element={<AddBook user={user} refreshBooks={refreshBooks} />}
          />
        </Route>
        <Route
          path="/book/:bookId"
          element={
            <BookDetails
              user={user}
              bookId={bookId}
              seller={seller}
              cartLength={cartLength}
            />
          }
        />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/edit-book/:bookId" element={<EditBook />} />
        <Route
          path="/author/:authorName"
          element={<AuthorDetails user={user} />}
        />
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
