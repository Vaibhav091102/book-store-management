import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";

const MyBook = ({ user }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${user._id}`)
      .then((res) => {
        const data = res.data.data;
        setBooks(Array.isArray(data) && data.length > 0 ? data[0].books : []);
      })
      .catch((err) => console.error(err));
  }, [user._id]);

  return (
    <>
      <BackButton />
      <div className="container">
        <h2 className="text-center mb-3">My Books</h2>

        {books.length === 0 ? (
          <div className="text-center mt-4">
            <p>No books found. Please upload one.</p>
            <Link
              to={`/seller/add-book/${user._id}`}
              className="btn btn-primary"
            >
              Add Book
            </Link>
          </div>
        ) : (
          <div className="row">
            {books.map((book) => (
              <div className="col-md-3 mb-3" key={book._id}>
                <div
                  className="card h-100 shadow-sm book-card "
                  style={{
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
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
                    <p className="text-muted">{book.author}</p>
                    <p className="text-primary fw-bold">₹{book.price}</p>
                  </Link>
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
        <style>
          {`
          .book-card:hover {
            transform: scale(1.02);
            box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
            }
            `}
        </style>
      </div>
    </>
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
  setBookId: PropTypes.func.isRequired,
};

export default MyBook;
