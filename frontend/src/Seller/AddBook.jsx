import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container, Card } from "react-bootstrap";

const AddBook = ({ user }) => {
  const [bookData, setBookData] = useState({
    name: "",
    author: "",
    price: "",
    summary: "",
    publisher: "",
    publishedYear: "",
    availableCopies: 1,
    // image: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // Handle input changes
  const handleChange = (e) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Preview the uploaded image
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    // Append text fields
    Object.entries(bookData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append the image
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post(
        `http://localhost:5000/api/products/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set header for file upload
          },
        }
      );
      setSuccess("Book uploaded successfully!");
      setTimeout(() => navigate("/seller/mybook"), 1000);
      setError("");
    } catch (err) {
      console.error(
        "Error uploading book:",
        err.response ? err.response.data : err.message
      );
      setError("Failed to upload the book.");
    }
  };

  return (
    <Container className="my-5">
      <Card className="p-4 shadow-sm rounded">
        <h3 className="text-center mb-4">Add New Book</h3>

        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Book Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter book name"
              value={bookData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              name="author"
              placeholder="Enter author name"
              value={bookData.author}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price (₹)</Form.Label>
            <Form.Control
              type="number"
              name="price"
              placeholder="Enter price"
              value={bookData.price}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Summary</Form.Label>
            <Form.Control
              as="textarea"
              name="summary"
              placeholder="Enter a short summary"
              value={bookData.summary}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Publisher</Form.Label>
            <Form.Control
              type="text"
              name="publisher"
              placeholder="Enter publisher name"
              value={bookData.publisher}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Published Year</Form.Label>
            <Form.Control
              type="number"
              name="publishedYear"
              placeholder="Enter year"
              value={bookData.publishedYear}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Available Copies</Form.Label>
            <Form.Control
              type="number"
              name="availableCopies"
              placeholder="Enter number of copies"
              value={bookData.availableCopies}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Book Cover</Form.Label>
            <Form.Control type="file" onChange={handleImageChange} required />
            {preview && (
              <img
                src={preview}
                alt="Book Cover Preview"
                className="mt-3 rounded"
                width="50px"
                height="50px"
              />
            )}
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Add Book
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default AddBook;

AddBook.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
};
