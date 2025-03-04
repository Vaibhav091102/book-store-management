import NavBar from "./NavBar";
import { Link, Outlet, useLocation } from "react-router-dom"; // ✅ Import useLocation
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SellerHome({ reload }) {
  const location = useLocation();
  const isDashboard = location.pathname === "/seller";
  const [books, setBooks] = useState([]);

  const [user, setUser] = useState(null);
  // const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setError("User not logged in");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/api/get-all-product`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.data;
        // Extract all books from products
        const books = data.flatMap((product) => product.books || []);
        setBooks(books);
      })
      .catch((err) => console.error(err));
  }, [reload]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <NavBar user={user} />
      <div className="container mt-1">
        {/* ✅ Conditionally render Seller Dashboard only when path is `/seller` */}
        {isDashboard ? (
          <>
            <h2 className="text-center mt-4">Welcome to Seller Dashboard</h2>
            <div className="container mt-4">
              {books.length === 0 ? (
                <div className="text-center mt-4">
                  <p>No books found. Please upload one.</p>
                </div>
              ) : (
                <div className="row">
                  {books.map((book) => (
                    <div className="col-md-3 mb-3" key={book._id}>
                      <div
                        className="card h-100 shadow-sm book-card "
                        style={{
                          transition:
                            "transform 0.3s ease, box-shadow 0.3s ease",
                        }}
                      >
                        <Link
                          to={`/book/${book._id}`}
                          className="text-decoration-none text-dark m-2"
                          // onClick={setProductId=}
                        >
                          <img
                            src={
                              book.image
                                ? `http://localhost:5000/${book.image.replace(
                                    /\\/g,
                                    "/"
                                  )}`
                                : "/placeholder.png"
                            }
                            alt={book.name}
                            className="img-fluid"
                          />

                          <h5 className="m-1">{book.name}</h5>
                          <p className="m-2 text-muted">{book.author}</p>
                          <p className="m-2 text-primary fw-bold">
                            ₹{book.price}
                          </p>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <Outlet /> // ✅ Render child components like Profile & MyBooks
        )}
      </div>
      <style>
        {`
          .book-card:hover {
            transform: scale(1.03);
            box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>
    </div>
  );
}
SellerHome.propTypes = {
  user: PropTypes.string.isRequired, // Define that setUser is a required function prop
  reload: PropTypes.bool.isRequired,
};
