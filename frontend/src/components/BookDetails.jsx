import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

const BookDetails = ({ user }) => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();
  const handleAddToCart = async (book) => {
    try {
      const response = await axios.post("http://localhost:5000/api/cart/add", {
        userId: user._id,
        bookId: book._id,
        quantity: 1,
      });
      console.log(response);

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

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/singleproduct/${id}`) // Fetch book details
      .then((res) => setBook(res.data.data))
      .catch((err) => console.error("Error fetching book details:", err));
  }, [id]);

  if (!book) {
    return <h3 className="text-center mt-5">Loading...</h3>;
  }

  return (
    <div className="container mt-5">
      <div className="row m-1">
        {/* Left Side - Image & Book Name */}
        <div className="col-md-6 d-flex flex-column align-items-start">
          <img
            src={`http://localhost:5000/${book.image.replace(/\\/g, "/")}`}
            alt={book.name}
            className="img-fluid rounded shadow mb-3"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
          <h2>{book.name || "Unknown Title"}</h2>
        </div>

        {/* Right Side - Details */}
        <div className="col-md-6">
          <p className="text-muted">by {book.author || "Unknown Author"}</p>
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
        </div>
      </div>
    </div>
  );
};

export default BookDetails;

BookDetails.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
};
