import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const MyBook = ({ user }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${user._id}`)
      .then((res) => {
        const data = res.data.data;
        setBooks(Array.isArray(data) ? data : []); // Ensure books is always an array
      })
      .catch((err) => console.error(err));
  }, [user._id]);

  return (
    <div className="container mt-5">
      <h2 className="text-center">My Books</h2>
      {books.length === 0 ? (
        <div className="text-center mt-4">
          <p>No books found. Please upload one.</p>
          <Link to={`/seller/add-book/${user._id}`} className="btn btn-primary">
            Add Book
          </Link>
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
          <Link
            to={`/seller/add-book/${user._id}`}
            className="btn btn-primary m-2"
          >
            Add Book
          </Link>
        </div>
      )}
    </div>
  );
};

MyBook.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired, // MongoDB ObjectId is a string
  }).isRequired,
  book: PropTypes.shape({
    _id: PropTypes.string.isRequired, // MongoDB ObjectId is a string
  }).isRequired,
  setBook: PropTypes.string.isRequired,
};

export default MyBook;
