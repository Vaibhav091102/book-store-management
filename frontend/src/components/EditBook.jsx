import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import BackButton from "./BackButton";

const EditBook = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  // Initially, set book to null instead of empty values
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/single-product-details/${bookId}`
        );

        setBook(response.data.data); // Set book data properly
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };
    fetchBookDetails();
  }, [bookId]);

  // Handle change for input fields
  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/products/update/${bookId}`,
        book
      );
      alert("Book updated successfully!");
      navigate("/seller/mybook");
    } catch (error) {
      console.error("Update Error:", error);
      alert("Failed to update book. Please try again.");
    }
  };

  // **Prevent rendering form before data is loaded**
  if (!book) {
    return <h3 className="text-center mt-5">Loading book details...</h3>;
  }

  return (
    <div className="container mt-3">
      <BackButton />
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">Edit Book</h2>
        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              value={book.name || ""}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Author</label>
            <input
              type="text"
              name="author"
              value={book.author || ""}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Price</label>
              <input
                type="number"
                name="price"
                value={book.price || ""}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Published Year</label>
              <input
                type="number"
                name="publishedYear"
                value={book.publishedYear || ""}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Available Copies</label>
              <input
                type="number"
                name="availableCopies"
                value={book.availableCopies || ""}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Publisher</label>
            <input
              type="text"
              name="publisher"
              value={book.publisher || ""}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Summary</label>
            <textarea
              name="summary"
              value={book.summary || ""}
              onChange={handleChange}
              className="form-control"
              rows="3"
            ></textarea>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary px-4">
              Save
            </button>
            <button
              type="button"
              className="btn btn-secondary ms-3 px-4"
              onClick={() => navigate("/seller/mybook")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBook;
