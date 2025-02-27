import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // Track if search button is clicked

  const handleSearch = async () => {
    if (!query.trim()) return; // Prevent empty search

    setLoading(true);
    setSearched(true); // Mark that search button was clicked

    try {
      const res = await axios.get(
        `http://localhost:5000/api/books?search=${query}`
      );
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }

    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="input-group me-2 ">
            <input
              type="text"
              className="form-control me-2 rounded-2"
              placeholder="Search books..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="btn btn-primary rounded-2"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          {loading && <p className="text-primary">🔄 Searching...</p>}

          <ul className="list-group mt-3">
            {searched && // Show results only after clicking Search
              (books.length > 0 ? (
                books.map((book) => (
                  <Link
                    to={`/book/${book._id}`}
                    style={{ textDecoration: "none", color: "black" }}
                    key={book._id}
                  >
                    <li
                      key={book._id}
                      className="list-group-item list-group-item-action rounded-2"
                      style={{ cursor: "pointer" }}
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
                        alt="image"
                        className="img-fluid"
                        style={{
                          maxHeight: "30px",
                          objectFit: "cover",
                        }}
                      />{" "}
                      <strong>{book.name}</strong> by {book.author}
                    </li>
                  </Link>
                ))
              ) : (
                <p className="text-danger">❌ No books found</p>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
