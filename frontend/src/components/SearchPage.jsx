import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BackButton from "./BackButton";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // Track if search was performed

  useEffect(() => {
    if (!query.trim()) {
      setBooks([]); // Clear results when input is empty
      return;
    }

    const fetchBooks = async () => {
      setLoading(true);
      setSearched(true);

      try {
        const res = await axios.get(
          `http://localhost:5000/api/get-books-by-search?search=${query}`
        );
        setBooks(res.data.data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }

      setLoading(false);
    };

    const debounceTimeout = setTimeout(fetchBooks, 500); // Debounce to reduce API calls

    return () => clearTimeout(debounceTimeout); // Cleanup previous timeout
  }, [query]);

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="input-group">
            <BackButton />
            <input
              type="text"
              className="form-control m-2 rounded-2"
              placeholder="Search books..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="btn btn-primary m-2 rounded-2 py-0"
              onClick={() => setSearched(true)}
            >
              Search
            </button>
          </div>

          {loading && <p className="text-primary">🔄 Searching...</p>}

          <ul className="list-group mt-3">
            {searched && // Show results only after searching
              (books.length > 0 ? (
                books.map((book) => (
                  <Link
                    to={`/book/${book._id}`}
                    style={{ textDecoration: "none", color: "black" }}
                    key={book._id}
                  >
                    <li
                      className="list-group-item list-group-item-action rounded-2 d-flex align-items-center"
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
                        alt="Book Cover"
                        className="img-fluid me-2"
                        style={{
                          maxHeight: "40px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <strong>{book.name}</strong> by {book.author}
                      </div>
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
