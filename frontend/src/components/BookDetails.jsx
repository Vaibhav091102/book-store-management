import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import NavBarB from "../buyer/NavBarB";
import NavBar from "../Seller/NavBar";
import BackButton from "./BackButton";

const BookDetails = ({ user, seller }) => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();

  const handleAddToCart = async (book) => {
    try {
      const response = await axios.post("http://localhost:5000/api/cart/add", {
        userId: user._id,
        productId: book.productId,
        bookId: book._id,
        // bookName: book.name,
        // bookPrice: book.price,
        quantity: 1,
      });

      if (response.status === 200 || response.status === 201) {
        alert("Book added to cart successfully!");
      }
    } catch (error) {
      console.error("Error adding book to cart:", error);
    }
    setTimeout(() => {
      navigate("/buyer/cart");
    }, 0);
  };

  const handleDelete = async (bookId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/products/delete-book/${bookId}`
      );

      if (response.data.success) {
        alert("Book deleted successfully!");
        navigate("/seller/mybook");
      } else {
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      console.error(
        "Delete Error:",
        error.response ? error.response.data : error
      );
      alert("Failed to delete book. Please try again.");
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/single-product-details/${bookId}`)
      .then((res) => {
        setBook(res.data.data); // Correctly accessing the book data
      })
      .catch((err) => console.error("Error fetching book details:", err));
  }, [bookId]);

  if (!book) {
    return <h3 className="text-center mt-5">Loading...</h3>;
  }

  return (
    <>
      {user && user.role === "buyer" ? (
        <NavBarB user={user} />
      ) : (
        <NavBar user={user} />
      )}
      <BackButton />
      <div className="container mt-0">
        <div className="row m-1">
          {/* Left Side - Image & Book Name */}
          <div className="col-md-6 d-flex flex-column align-items-start">
            <img
              src={
                book.image
                  ? `http://localhost:5000/${book.image.replace(/\\/g, "/")}`
                  : "default-image.jpg"
              }
              alt={book.name || "No Image Available"}
              className="img-fluid rounded shadow mb-3"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
            <h2>{book.name || "Unknown Title"}</h2>
          </div>

          {/* Right Side - Details */}
          <div className="col-md-6">
            <p className="text-muted">
              by{" "}
              <Link
                to={`/author/${encodeURIComponent(book.author)}`}
                className="text-primary"
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                {book.author || "Unknown Author"}
              </Link>
            </p>
            <h4 className="text-success">₹{book.price || "N/A"}</h4>
            <p>
              <strong>Publisher:</strong> {book.publisher}
            </p>
            <p>
              <strong>Published Year:</strong> {book.publishedYear}
            </p>
            <p>
              <strong>Available Copies:</strong> {book.availableCopies}
            </p>
            <p className="mt-3">{book.summary}</p>

            {user && user.role === "buyer" && (
              <Button variant="primary" onClick={() => handleAddToCart(book)}>
                Add to Cart
              </Button>
            )}
            {user &&
              user.role === "seller" &&
              book.sellerId === seller.user_id && (
                <>
                  <Button
                    variant="warning"
                    className="ms-2"
                    onClick={() => navigate(`/edit-book/${book._id}`)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    className="ms-2"
                    onClick={() => handleDelete(bookId)}
                  >
                    Delete
                  </Button>
                </>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookDetails;

BookDetails.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  bookId: PropTypes.string.isRequired,
  seller: PropTypes.func.isRequired,
};
