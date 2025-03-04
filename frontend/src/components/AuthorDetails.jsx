import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import BackButton from "./BackButton";
import PropTypes from "prop-types";
import NavBar from "../Seller/NavBar";
import NavBarB from "../buyer/NavBarB";

const AuthorDetails = ({ user }) => {
  const { authorName } = useParams();
  const [books, setBooks] = useState([]);
  const [authorInfo, setAuthorInfo] = useState("");

  useEffect(() => {
    // Fetch books by this author from products collection
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/books-by-author/${authorName}`
        );
        setBooks(response.data.books);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    // Fetch author details from Wikipedia
    const fetchWikipediaInfo = async () => {
      try {
        const wikiResponse = await axios.get(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            authorName
          )}`
        );
        setAuthorInfo(wikiResponse.data.extract);
      } catch (error) {
        console.error("Error fetching author info:", error);
      }
    };

    fetchBooks();
    fetchWikipediaInfo();
  }, [authorName]);

  return (
    <>
      {user && user.role === "buyer" ? (
        <NavBarB user={user} />
      ) : (
        <NavBar user={user} />
      )}
      <BackButton />
      <div className="container">
        <h2 className="">{authorName}</h2>

        {/* Author Wikipedia Info */}
        {authorInfo && (
          <div className="alert alert-info">
            <strong>About {authorName}:</strong>
            <p>{authorInfo}</p>
          </div>
        )}

        {/* Display Books */}
        <div className="row">
          {books.length > 0 ? (
            books.map((book) => (
              <div key={book._id} className="col-md-3 mb-4">
                <div
                  className="card shadow"
                  style={{ width: "15rem", height: "100%" }}
                >
                  <div className="text-center img-fluid">
                    <img
                      src={`http://localhost:5000/${book.image}`}
                      className="card-img-top"
                      alt={book.name}
                      style={{
                        width: "80%",
                        height: "90%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{book.name}</h5>
                    <p className="text-success">₹{book.price}</p>
                    <Link
                      to={`/book/${book._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No books found by this author.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthorDetails;

AuthorDetails.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string.isRequired,
  }).isRequired,
  refreshBooks: PropTypes.func.isRequired,
};
