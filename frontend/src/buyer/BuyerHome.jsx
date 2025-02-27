import { Link, Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BuyerHome({ user }) {
  const location = useLocation();
  const isDashboard = location.pathname === "/buyer";
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/product`)
      .then((res) => {
        const data = res.data.data;
        setBooks(Array.isArray(data) ? data : []); // Ensure books is always an array
      })
      .catch((err) => console.error(err));
  }, [user._id]);

  return (
    <>
      <NavBar user={user} />
      {isDashboard ? (
        <div className="container mt-5">
          <h2>Welcome to Buyer Dashboard</h2>
          <div className="container mt-5">
            {books.length === 0 ? (
              <div className="text-center mt-4">
                <p>No books found. Please upload one.</p>
              </div>
            ) : (
              <div className="row">
                {books.map((book) => (
                  <div className="col-md-3 mb-3" key={book._id}>
                    <div className="card shadow-sm p-3">
                      <Link
                        to={`/book/${book._id}`}
                        style={{ textDecoration: "none", color: "black" }}
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

                        <h5 className="mt-2">{book.name}</h5>
                      </Link>
                      <p className="text-muted">{book.author}</p>
                      <p className="text-primary fw-bold">₹{book.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}

// ✅ Correct propTypes for BuyerHome
BuyerHome.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
};
